import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";

const createPlaylist = asyncHandlers(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }
  const playlist = new Playlist({
    name,
    description,
    user: req.user._id,
    videos: [],
  });
});

const getUserPlaylists = asyncHandlers(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const playlists = await Playlist.find({ user: userId });
  res
    .status(200)
    .json(new ApiResponse(200, "User playlists fetched", playlists));
});

const getPlaylistById = asyncHandlers(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  res.status(200).json(new ApiResponse(200, "Playlist fetched", playlist));
});

const addVideoToPlaylist = asyncHandlers(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Video added to playlist", playlist));
});

const removeVideoFromPlaylist = asyncHandlers(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in playlist");
  }
  playlist.videos = playlist.videos.filter((vid) => vid.toString() !== videoId);
  await playlist.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Video removed from playlist", playlist));
});

const deletePlaylist = asyncHandlers(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandlers(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (name) playlist.name = name;
  if (description) playlist.description = description;
  await playlist.save();
  res.status(200).json(new ApiResponse(200, "Playlist updated", playlist));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
