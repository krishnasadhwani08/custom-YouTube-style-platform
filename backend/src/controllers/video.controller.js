import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortType = req.query.sortType || "desc";
    const userId = req.query.userId;

    const filter = {};

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    const sortOrder = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .populate("owner", "fullName userName avatar")
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedVideo?.secure_url) {
        throw new ApiError(500, "Video upload failed");
    }

    if (!uploadedThumbnail?.secure_url) {
        throw new ApiError(500, "Thumbnail upload failed");
    }

    const savedVideo = await Video.create({
        title,
        description,
        videoFile: uploadedVideo.secure_url,
        thumbnail: uploadedThumbnail.secure_url,
        owner: userId,
        views: 0,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            savedVideo,
            "Video published successfully"
        )
    );
});

const getVideoById = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid videoId is required");
    }

    const video = await Video.findById(videoId)
        .populate("owner", "fullName userName avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.views += 1;

    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    const { title, description } = req.body;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid videoId is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (title) {
        video.title = title;
    }

    if (description) {
        video.description = description;
    }

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {

        const uploadedThumbnail =
            await uploadOnCloudinary(thumbnailLocalPath);

        if (!uploadedThumbnail?.secure_url) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

        video.thumbnail = uploadedThumbnail.secure_url;
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video updated successfully"
        )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid videoId is required");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { deleted: true },
            "Video deleted successfully"
        )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    const userId = req.user?._id;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid videoId is required");
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: userId
    });

    if (!video) {
        throw new ApiError(
            404,
            "Video not found or unauthorized"
        );
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isPublished: video.isPublished
            },
            "Publish status toggled successfully"
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};