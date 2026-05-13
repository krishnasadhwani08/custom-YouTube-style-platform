import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ApiError } from "./utils/ApiError.js";

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import likeRouter from "./routes/like.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/tweets", tweetRouter);

app.use("/api/v1/subscriptions",subscriptionRouter);

app.use((err, req, res, next) => {

    if (err instanceof ApiError) {

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }

    console.error("Unhandled Error:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

app.use("/api/v1/dashboard", dashboardRouter);

app.use("/api/v1/likes", likeRouter);

export { app };