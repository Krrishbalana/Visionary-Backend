import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandlers(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const filter = { isPublished: true };
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    filter.user = userId;
  }
  const sortOptions = {};
  if (sortBy) {
    const sortField = sortBy;
    const sortOrder = sortType === "desc" ? -1 : 1;
    sortOptions[sortField] = sortOrder;
  } else {
    sortOptions.createdAt = -1; // Default sorting by creation date descending
  }
  const videos = await Video.find(filter)
    .populate("user", "name email")
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const total = await Video.countDocuments(filter);
  res.status(200).json(
    new ApiResponse(200, "Videos fetched", {
      videos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    }),
  );
});

const publishAVideo = asyncHandlers(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title) {
    throw new ApiError(400, "Video title is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Video file is required");
  }
  // Upload video to Cloudinary
  const result = await uploadOnCloudinary(req.file.path, "video");
  // Create video document
  const video = new Video({
    title,
    description,
    url: result.secure_url,
    publicId: result.public_id,
    user: req.user._id,
    isPublished: false,
  });
  await video.save();
  res.status(201).json(new ApiResponse(201, "Video published", video));
});

const getVideoById = asyncHandlers(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId).populate("user", "name email");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  res.status(200).json(new ApiResponse(200, "Video fetched", video));
});

const updateVideo = asyncHandlers(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user is the owner of the video
  if (video.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // Update fields
  const { title, description } = req.body;
  if (title) video.title = title;
  if (description) video.description = description;
  await video.save();

  res.status(200).json(new ApiResponse(200, "Video updated", video));
});

const deleteVideo = asyncHandlers(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // Check if the user is the owner of the video
  if (video.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }
  await video.remove();
  res.status(200).json(new ApiResponse(200, "Video deleted", null));
});

const togglePublishStatus = asyncHandlers(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // Check if the user is the owner of the video
  if (video.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Video publish status toggled", video));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
