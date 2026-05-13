import dotenv from "dotenv";

import connectDB from "./db/index.js";

import { app } from "./app.js";

dotenv.config();

connectDB()
  .then(() => {

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });