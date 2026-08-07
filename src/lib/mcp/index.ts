import { defineMcp } from "@lovable.dev/mcp-js";
import searchVideosTool from "./tools/search-videos";
import getVideoTool from "./tools/get-video";
import listCategoriesTool from "./tools/list-categories";
import listPlaylistsTool from "./tools/list-playlists";
import getPlaylistTool from "./tools/get-playlist";

export default defineMcp({
  name: "streamline-hub",
  title: "Streamline Hub",
  version: "0.1.0",
  instructions:
    "Read-only tools for the ClipFlow public video catalog. Use `search_videos` to find videos by keyword, category, source or featured flag, `get_video` for full details of one video, `list_categories` for available categories, and `list_playlists` / `get_playlist` to browse curated playlists.",
  tools: [searchVideosTool, getVideoTool, listCategoriesTool, listPlaylistsTool, getPlaylistTool],
});