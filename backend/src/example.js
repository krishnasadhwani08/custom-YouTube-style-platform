import dotenv from "dotenv";
dotenv.config();

console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGODB_URI ? "Loaded ✅" : "❌ Not Found");
