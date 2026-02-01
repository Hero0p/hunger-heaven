# HungerHeaven - Food Delivery & Social Platform

HungerHeaven is a modern food delivery application that combines the convenience of ordering food with the engagement of a social platform. Users can browse restaurants, view menus, and also watch short food reels shared by food partners.

## 🚀 Features

*   **User & Partner Authentication**: Secure login/signup for both Foodies and Food Partners.
*   **Immersive Landing Page**: Dynamic and engaging landing page.
*   **Vertical Video Feed**: "Reels" style feed for discovering food through short videos.
*   **Food Partner Dashboard**: Dedicated dashboard for partners to manage menus and upload reels.
*   **Dynamic Comments**: Interactive comment sections on reels.
*   **Profile Management**: Update and view user/partner profiles with real-time data.
*   **Search & Discovery**: Efficient search for food items and partners.
*   **Saved Items**: Bookmark your favorite reels and food items.

## 🛠️ Tech Stack

### Frontend
*   **React 19**: Building the user interface.
*   **Vite**: Fast build tool and dev server.
*   **React Router DOM**: Client-side routing.
*   **Axios**: HTTP requests.
*   **CSS Modules / Vanilla CSS**: styling.

### Backend
*   **Node.js & Express.js**: Server-side framework.
*   **MongoDB & Mongoose**: Database and ODM.
*   **JWT & Cookie-Parser**: Secure authentication and session management.
*   **BcryptJS**: Password hashing.
*   **ImageKit**: Cloud storage for images and videos.
*   **Multer**: Handling file uploads.

## 🏗️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Atlas account or local MongoDB instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Hero0p/hunger-heaven.git
    cd hunger-heaven
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory:
        ```env
        PORT=3000
        MONGODB_URL=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
        IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
        IMAGEKIT_ENDPOINT_URL=your_imagekit_url
        ```
    *   Start the server:
        ```bash
        npm start
        # OR for development with nodemon
        npm run dev
        ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    ```
    *   Start the development server:
        ```bash
        npm run dev
        ```

4.  **Access the App**
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:3000`

## 🌍 Deployment

### Live Preview
[Insert Deployed Link Here]

The project is designed to be deployed easily.
*   **Frontend**: Vercel, Netlify
*   **Backend**: Render, Heroku

---
*Built with ❤️ by [Hero0p]*
