import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_playlist",
  title: "Get playlist with videos",
  description: "Fetch one public ClipFlow playlist by id, including its ordered list of videos.",
  inputSchema: {
    id: z.string().uuid().describe("The playlist id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const supabase = supabaseAnon();
    const { data: playlist, error } = await supabase
      .from("playlists")
      .select("id, title, description, category, thumbnail_url, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!playlist) return { content: [{ type: "text", text: `No playlist found with id ${id}` }], isError: true };

    const { data: items, error: itemsError } = await supabase
      .from("playlist_videos")
      .select("sort_order, videos(id, title, description, category, source, duration, thumbnail_url, embed_url, views)")
      .eq("playlist_id", id)
      .order("sort_order", { ascending: true });
    if (itemsError) return { content: [{ type: "text", text: itemsError.message }], isError: true };

    const videos = (items ?? []).map((item) => item.videos).filter(Boolean);
    const result = { ...playlist, videos };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { playlist: result },
    };
  },
});