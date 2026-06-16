import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createStorageClient() {
  if (!supabaseUrl || !supabaseKey) return null;

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  }).storage;
}

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string | null> {
  const storage = createStorageClient();
  if (!storage) return null;

  const { error } = await storage.from('mipyme-images').upload(filename, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error('[supabase] upload error:', error);
    return null;
  }

  const { data: publicUrl } = storage.from('mipyme-images').getPublicUrl(filename);
  return publicUrl.publicUrl;
}
