// utils/fakeEngagement.js
const store = new Map();

function getEngagement(foodPartnerId) {
  let data = store.get(foodPartnerId);

  // First-time visit
  if (!data) {
    const base =
      (Math.random() * (30 - 15) + 15); // 15K – 30K

    data = {
      value: parseFloat(base.toFixed(2)),
      views: 1
    };

    store.set(foodPartnerId, data);
  } else {
    data.views += 1;

    // Every 3 views → increment
    if (data.views % 3 === 0) {
      data.value += 0.17;
      data.value = parseFloat(data.value.toFixed(2));
    }
  }

  return `${data.value}K`;
}

module.exports = { getEngagement };
