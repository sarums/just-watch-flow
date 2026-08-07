import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const VIDEO_FIELDS =
  "id, title, description, category, source, duration, tags, thumbnail_url, embed_url, featured, views, created_at";

export default defineTool({
  name: "search_videos",
  title: "Search videos",
  description:
    "Search the public ClipFlow video catalog by keyword, category, source or featured flag. Returns matching videos ordered by newest first.",
  inputSchema: {
    query: z.string().trim().optional().describe("Keyword matched against video title and description."),
    category: z.string().trim().optional().describe("Category value, e.g. 'music' or 'sports'."),
    source: z.enum(["dailymotion", "rumble"]).optional().describe("Video source platform."),
    featured: z.boolean().optional().describe("Only return featured videos when true."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of videos to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, source, featured, limit }) => {
    const supabase = supabaseAnon();
    let request = supabase.from("videos").select(VIDEO_FIELDS).order("created_at", { ascending: false });

    if (query) request = request.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    if (category) request = request.eq("category", category);
    if (source) request = request.eq("source", source);
    if (featured !== undefined) request = request.eq("featured", featured);

    const { data, error } = await request.limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { videos: data ?? [], count: data?.length ?? 0 },
    };
  },
});