# project on backend of youtube

video_x – Backend API

    This is the backend for video_x, a server-side application built using Node.js and Express.
    It includes user authentication, video model handling, Cloudinary integration, and a structured MVC architecture, making it scalable and easy to maintain.

Features

    User authentication and authorization

    User and video data models (MongoDB + Mongoose)

    Cloudinary integration for media uploads

    Modular MVC structure

    Custom error & response handlers

    Middleware-based architecture

    Environment variable configuration

    Organized utils and reusable functions

Tech Stack

    Node.js

    Express.js

    MongoDB + Mongoose

    Cloudinary

    JWT (if used in auth.middleware.js)

    dotenv

Folder Structure

    backend/

│
├── public/
│ └── temp/
│
├── src/
│ ├── controllers/
│ │ └── user.controller.js
│ │
│ ├── db/
│ │ └── index.js
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ └── middlewares.js
│ │
│ ├── models/
│ │ ├── user.model.js
│ │ └── video.model.js
│ │
│ ├── routes/
│ │ ├── tempCodeRunnerFile.js
│ │ └── user.routes.js
│ │
│ └── utils/
│ ├── ApiError.js
│ ├── ApiResponse.js
│ ├── asyncHandler.js
│ └── cloudinary.js
│
├── app.js
├── constants.js
├── example.js
├── index.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

Setup Instructions
Clone the repository
git clone https://github.com/your-username/video_x.git
cd video_x

    Install dependencies

    npm install

Environment Variables

    Create a .env file in the project root and add:
    PORT=5000
    MONGODB_URI=your_mongo_connection_string
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    JWT_SECRET=your_secret_key

Running the Server
npm run dev

Production Mode
npm start

API Endpoints

    User Routes (/api/v1/users)
    Method Endpoint Description
    POST /register Create a new user
    POST /login Login user
    GET /profile Get user profile (Auth required)

Utilities Included

    ApiError.js – Standardized error responses

    ApiResponse.js – Unified response structure

    asyncHandler.js – Async function wrapper

    cloudinary.js – Cloudinary upload handler

Contributing

    Pull requests are welcome, after the project is finished (it was for learning purposes)
    Before making major changes, open an issue to discuss what you’d like to improve.

License

    MIT License
