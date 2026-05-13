import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400,"Video is needed")
    }
    const skip=(Number(page)-1)*Number(limit)
    

    const comments =await Comment.find({video:videoId})
    .skip(skip).
    limit(Number(limit))
    .sort({createdAt:-1});

    if(comments.length==0){
        return res.status(200).json(new ApiResponse(200,[],"No comments "))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comments,"comments fetchd successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {content} = req.body;
    const {videoId} = req.params;
    const userId = req.user?._id;

    if(!content){
        throw new ApiError(400,"Content is required")
    }

    if(!videoId){
        throw new ApiError(400,"VideoId is required")
    }

    const comments = await Comment.create({
        content : content,
        video : videoId,
        user : userId
    })

    if(!comments){
        throw new ApiError(500,"Something went wrong")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comments,"Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} =req.params;
    const {content} =req.body;

    if(!content){
        throw new ApiError(400,"Content is required")
    }

    if(!commentId){
        throw new ApiError(400,"CommentId is required")
    }

    const comment = findByIdAndUpdate(commentId,content)

    if(!comment){
        throw new ApiError(400,"Comment not found")
    }

    //return statement

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {videoId} = req.params;
    const userId = req.user?._id;
    if(!commentId){
        throw new ApiError(400,"the commentid is needed")
    }
    if(!videoId){
        throw new ApiError(400,"the videoId is needed")
    }
    const comment = await Comment.deleteOne({
        _id:commentId,
        video : videoId,
        user:userId
    });
    if (comment.deletedCount === 0) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    return res.status(200).json(new ApiResposnse(200,comment,"The comment deleted"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }