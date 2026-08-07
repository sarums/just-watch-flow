import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_playlists",
  title: "List playlists",
  description: "List public ClipFlow playlists, optionally filtered by category.",
  inputSchema: {
    category: z.string().trim().optional().describe("Category value to filter playlists by."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of playlists (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }) => {
    const supabase = supabaseAnon();
    let request = supabase
      .from("playlists")
      .select("id, title, description, category, thumbnail_url, created_at")
      .order("created_at", { ascending: false });
    if (category) request = request.eq("category", category);
    const { data, error } = await request.limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { playlists: data ?? [], count: data?.length ?? 0 },
    };
  },
});