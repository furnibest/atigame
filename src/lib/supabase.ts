import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY) as string | undefined;

  // Debug logging
  console.log("🔍 Environment Check:");
  console.log("SUPABASE_URL:", supabaseUrl ? "✅ SET" : "❌ NOT SET");
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ SET" : "❌ NOT SET"
  );
  console.log(
    "SUPABASE_ANON_KEY:",
    process.env.SUPABASE_ANON_KEY ? "✅ SET" : "❌ NOT SET"
  );

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase environment variables are not set. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)."
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceKey);
  return cachedClient;
}

export async function uploadImageToSupabase(
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<string> {
  const client = getSupabaseClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "images";

  // Check if Service Role Key is available (required for storage upload)
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for image upload. Please add it to .env.local file. Get it from Supabase Dashboard → Settings → API → service_role key."
    );
  }

  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `furniture-store/${Date.now()}-${sanitized}`;

  console.log(`📤 Uploading to bucket: ${bucket}, path: ${path}`);

  try {
    const { data: uploadData, error } = await client.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: contentType || "image/*",
        upsert: true,
      });

    if (error) {
      console.error("❌ Storage upload error:", error);
      throw new Error(
        `Storage upload failed: ${error.message}. Make sure the bucket "${bucket}" exists and is configured correctly.`
      );
    }

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image");
    }

    console.log("✅ Image uploaded successfully:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    if (error instanceof Error) {
      // Check for common errors
      if (
        error.message.includes("fetch failed") ||
        error.message.includes("network")
      ) {
        throw new Error(
          `Network error: Cannot connect to Supabase Storage. Check your internet connection and Supabase URL.`
        );
      }
      throw error;
    }
    throw new Error("Unknown error during image upload");
  }
}

export function extractStoragePathFromPublicUrl(
  publicUrl: string
): { bucket: string; path: string } | null {
  try {
    const url = new URL(publicUrl);
    const parts = url.pathname.split("/");
    const publicIdx = parts.findIndex((p) => p === "public");
    if (publicIdx === -1 || publicIdx + 2 >= parts.length) return null;
    const bucket = parts[publicIdx + 1];
    const path = parts.slice(publicIdx + 2).join("/");
    if (!bucket || !path) return null;
    return { bucket, path };
  } catch {
    return null;
  }
}

export async function deleteImageByPublicUrl(publicUrl: string): Promise<void> {
  const client = getSupabaseClient();
  const extracted = extractStoragePathFromPublicUrl(publicUrl);
  if (!extracted) return;
  const { bucket, path } = extracted;
  await client.storage.from(bucket).remove([path]);
}
