import mongoose from "mongoose";

import { Comment } from "../models/comment.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

/* ─────────────────────────────────────────────
   Get Video Comments
───────────────────────────────────────────── */

const getVideoComments = asyncHandler(
async (req, res) => {

    const { videoId } = req.params;

    const userId = req.user?._id;

    const {
        page = 1,
        limit = 10
    } = req.query;

    if (!videoId) {

        throw new ApiError(
            400,
            "Video ID required"
        );
    }

    const skip =
        (Number(page) - 1) *
        Number(limit);

    const comments =
        await Comment.aggregate([

            {
                $match: {
                    video:
                    new mongoose.Types.ObjectId(
                        videoId
                    )
                }
            },

            {
                $lookup: {

                    from: "users",

                    localField: "user",

                    foreignField: "_id",

                    as: "user",

                    pipeline: [

                        {
                            $project: {

                                fullName: 1,

                                userName: 1,

                                avatar: 1
                            }
                        }
                    ]
                }
            },

            {
                $lookup: {

                    from: "likes",

                    localField: "_id",

                    foreignField: "comment",

                    as: "likes"
                }
            },

            {
                $addFields: {

                    user: {
                        $first: "$user"
                    },

                    likesCount: {
                        $size: "$likes"
                    },

                    isLiked: {

                        $cond: {

                            if: {
                                $in: [
                                    new mongoose.Types.ObjectId(
                                        userId
                                    ),
                                    "$likes.likedBy"
                                ]
                            },

                            then: true,

                            else: false
                        }
                    }
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            },

            {
                $skip: skip
            },

            {
                $limit: Number(limit)
            }
        ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Comments fetched successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Add Comment
───────────────────────────────────────────── */

const addComment = asyncHandler(
async (req, res) => {

    const { content } = req.body;

    const { videoId } = req.params;

    const userId = req.user?._id;

    if (!content) {

        throw new ApiError(
            400,
            "Content required"
        );
    }

    if (!videoId) {

        throw new ApiError(
            400,
            "Video ID required"
        );
    }

    const comment =
        await Comment.create({

            content,

            video: videoId,

            user: userId
        });

    const populatedComment =
        await Comment.findById(
            comment._id
        ).populate(
            "user",
            "fullName userName avatar"
        );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedComment,
                "Comment added successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Update Comment
───────────────────────────────────────────── */

const updateComment = asyncHandler(
async (req, res) => {

    const { commentId } =
        req.params;

    const { content } =
        req.body;

    const userId =
        req.user?._id;

    if (!commentId) {

        throw new ApiError(
            400,
            "Comment ID required"
        );
    }

    if (!content) {

        throw new ApiError(
            400,
            "Content required"
        );
    }

    const comment =
        await Comment.findOneAndUpdate(

            {
                _id: commentId,

                user: userId
            },

            {
                $set: {
                    content
                }
            },

            {
                new: true
            }
        ).populate(
            "user",
            "fullName userName avatar"
        );

    if (!comment) {

        throw new ApiError(
            404,
            "Comment not found or unauthorized"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment updated successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Delete Comment
───────────────────────────────────────────── */

const deleteComment = asyncHandler(
async (req, res) => {

    const { commentId } =
        req.params;

    const userId =
        req.user?._id;

    if (!commentId) {

        throw new ApiError(
            400,
            "Comment ID required"
        );
    }

    const deletedComment =
        await Comment.findOneAndDelete({

            _id: commentId,

            user: userId
        });

    if (!deletedComment) {

        throw new ApiError(
            404,
            "Comment not found or unauthorized"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedComment,
                "Comment deleted successfully"
            )
        );
});

/* ─────────────────────────────────────────────
   Export
───────────────────────────────────────────── */

export {

    getVideoComments,

    addComment,

    updateComment,

    deleteComment
};