import { Router } from "express";

import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/middlewares.js";

const videoRouter = Router();

videoRouter.route("/")
    .get(getAllVideos);

videoRouter.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

videoRouter.route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo);

videoRouter.route("/:videoId/update")
    .patch(
        verifyJWT,
        upload.single("thumbnail"),
        updateVideo
    );

videoRouter.route("/:videoId/toggle-publish")
    .patch(
        verifyJWT,
        togglePublishStatus
    );

export default videoRouter;