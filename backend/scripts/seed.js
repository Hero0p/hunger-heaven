// Seed demo restaurants, menus and reels into MONGODB_URL.
//
//   npm run seed              upload media to ImageKit, then write to the database
//   npm run seed -- --dry-run check every source URL, write nothing
//
// Restaurants are matched by email, so re-running replaces their menu/reels instead of duplicating.
// Other partners, users and their data are never touched.
// Partner password: SEED_PARTNER_PASSWORD, or a random one printed at the end (only set on create
// unless SEED_PARTNER_PASSWORD is given).
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ImageKit = require("@imagekit/nodejs");
const foodPartnerModel = require("../src/models/foodpartner.model");
const foodModel = require("../src/models/food.model");
const likeModel = require("../src/models/likes.model");
const saveModel = require("../src/models/save.model");
const commentModel = require("../src/models/comment.model");
const restaurants = require("./seed-data");

const DRY_RUN = process.argv.includes("--dry-run");
const FOLDER = "hungerheaven-seed";
const CONCURRENCY = 6;

// Run fn over items with at most `limit` in flight
async function mapLimit(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const i = next++;
            results[i] = await fn(items[i], i);
        }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
}

// Stable ImageKit path for a source URL, so re-runs overwrite instead of piling up copies
function targetFor(sourceUrl) {
    const fileName = path.basename(new URL(sourceUrl).pathname);
    const subfolder = fileName.endsWith(".mp4") ? "reels" : "images";
    return { folder: `/${FOLDER}/${subfolder}`, fileName };
}

async function checkSource(url) {
    const res = await fetch(url, { method: "HEAD" });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !(type.startsWith("image/") || type.startsWith("video/"))) {
        throw new Error(`Source not usable (${res.status} ${type}): ${url}`);
    }
}

// filePath -> canonical delivery URL for everything already in the seed folders.
// Use these URLs rather than building them: they carry ?updatedAt= (videos also get /ik-video.mp4),
// and a bare path can keep serving a CDN-cached 404 from before the file existed.
async function listHosted(imagekit) {
    const hosted = new Map();
    for (const folder of [`/${FOLDER}/images`, `/${FOLDER}/reels`]) {
        const files = await imagekit.assets.list({ path: folder, limit: 1000 });
        for (const f of files) if (f.type === "file") hosted.set(f.filePath, f.url);
    }
    return hosted;
}

async function uploadAll(sourceUrls) {
    const imagekit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
    const existing = await listHosted(imagekit);
    const missing = sourceUrls.filter((src) => {
        const { folder, fileName } = targetFor(src);
        return !existing.has(`${folder}/${fileName}`);
    });
    console.log(`  ${sourceUrls.length - missing.length} already on ImageKit, ${missing.length} to upload`);

    let done = 0;
    await mapLimit(missing, CONCURRENCY, async (src) => {
        const { folder, fileName } = targetFor(src);
        // ImageKit fetches the source URL server-side
        await imagekit.files.upload({ file: src, fileName, folder, useUniqueFileName: false });
        console.log(`  [${++done}/${missing.length}] uploaded ${folder}/${fileName}`);
    });

    const listed = missing.length ? await listHosted(imagekit) : existing;
    const hosted = new Map();
    for (const src of sourceUrls) {
        const { folder, fileName } = targetFor(src);
        const url = listed.get(`${folder}/${fileName}`);
        if (!url) throw new Error(`Uploaded file not found on ImageKit: ${folder}/${fileName}`);
        hosted.set(src, url);
    }
    return hosted;
}

// Spread each restaurant's reels across the feed: 1st reel of every restaurant, then 2nd, ...
function interleave(groups) {
    const out = [];
    const rounds = Math.max(...groups.map((g) => g.length));
    for (let round = 0; round < rounds; round++) {
        for (const group of groups) if (group[round]) out.push(group[round]);
    }
    return out;
}

async function main() {
    const sources = [...new Set(restaurants.flatMap((r) => [
        r.image,
        ...r.menu.map((m) => m.image),
        ...r.reels.map((v) => v.video),
    ]))];

    console.log(`${restaurants.length} restaurants, ${restaurants.reduce((n, r) => n + r.menu.length, 0)} menu items, ${restaurants.reduce((n, r) => n + r.reels.length, 0)} reels, ${sources.length} unique media files`);

    console.log("Checking media sources...");
    await mapLimit(sources, CONCURRENCY, checkSource);
    console.log("All sources OK.");
    if (DRY_RUN) return;

    console.log("Uploading media to ImageKit...");
    const hosted = await uploadAll(sources);

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected.");

    const plainPassword = process.env.SEED_PARTNER_PASSWORD || crypto.randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    let createdAny = false;
    const reelGroups = [];

    for (const r of restaurants) {
        const fields = {
            name: r.name,
            contactName: r.contactName,
            phone: r.phone,
            address: r.address,
            image: hosted.get(r.image),
            cuisine: r.cuisine,
            rating: r.rating,
        };

        let partner = await foodPartnerModel.findOne({ email: r.email });
        if (partner) {
            // Replace this restaurant's previous seed items and anything attached to them
            const oldIds = (await foodModel.find({ foodPartner: partner._id }).select("_id")).map((f) => f._id);
            await Promise.all([
                likeModel.deleteMany({ food: { $in: oldIds } }),
                saveModel.deleteMany({ food: { $in: oldIds } }),
                commentModel.deleteMany({ food: { $in: oldIds } }),
                foodModel.deleteMany({ _id: { $in: oldIds } }),
            ]);
            Object.assign(partner, fields);
            if (process.env.SEED_PARTNER_PASSWORD) partner.password = passwordHash;
            await partner.save();
            console.log(`  updated ${r.name} (replaced ${oldIds.length} items)`);
        } else {
            partner = await foodPartnerModel.create({ ...fields, email: r.email, password: passwordHash });
            createdAny = true;
            console.log(`  created ${r.name}`);
        }

        await foodModel.insertMany(r.menu.map((m) => ({
            name: m.name,
            description: m.description,
            price: m.price,
            image: hosted.get(m.image),
            video: "",
            foodPartner: partner._id,
        })));

        reelGroups.push(r.reels.map((v) => ({
            name: v.name,
            description: v.description,
            video: hosted.get(v.video),
            foodPartner: partner._id,
        })));
    }

    // Feed shows newest first, so insert in reverse to put round one on top.
    // Demo engagement counts are deterministic so re-runs look the same.
    const reels = interleave(reelGroups).map((reel, i) => ({
        ...reel,
        likeCount: 120 + ((i * 7919) % 2300),
        savesCount: 15 + ((i * 104729) % 380),
    })).reverse();
    await foodModel.insertMany(reels);

    console.log(`Done: ${restaurants.length} restaurants, ${reels.length} reels.`);
    if (createdAny || process.env.SEED_PARTNER_PASSWORD) {
        console.log(`Partner login password: ${plainPassword}`);
    }
}

main()
    .catch((err) => {
        console.error("Seed failed:", err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
