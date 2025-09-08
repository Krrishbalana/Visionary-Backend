import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

const getVideoComments = asyncHandlers(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  const comments = await Comment.find({ video: videoId })
    .populate("user", "username avatar fullname")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalComments = await Comment.countDocuments({ video: videoId });
  return res.status(200).json(
    new ApiResponse(true, "Comments fetched successfully", {
      comments,
      totalComments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / limit),
    }),
  );
});

const addComment = asyncHandlers(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(true, "Comment added successfully", comment));
});

const updateComment = asyncHandlers(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }
  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }
});

const deleteComment = asyncHandlers(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }
  await Comment.findOneAndDelete({ _id: commentId, owner: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(true, "Comment deleted successfully", null));
});

export { getVideoComments, addComment, updateComment, deleteComment };
