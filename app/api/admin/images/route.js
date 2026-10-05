import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/server-auth';
import { adminDb, adminDbMissingResponse } from '../../../../lib/service-db';

const BUCKET = 'images';
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const db = adminDb(request);
  if (!db) return adminDbMissingResponse();

  const root = await db.storage.from(BUCKET).list('', { limit: 1000 });
  if (root.error) return NextResponse.json({ error: root.error.message }, { status: 400 });

  // Recurse into subfolders — uploads are namespaced (e.g. ump-2026/…), and a
  // root-only listing hid every nested object from the picker.
  const walk = async (prefix) => {
    const { data: entries } = await db.storage.from(BUCKET).list(prefix, { limit: 1000 });
    const files = [];
    const dirs = [];
    for (const entry of entries || []) {
      // Supabase marks folder placeholders with null id/metadata.
      const isFolder = entry.metadata === null || entry.id === null;
      if (isFolder) dirs.push(`${prefix}${entry.name}/`);
      else files.push({ ...entry, name: `${prefix}${entry.name}` });
    }
    for (const dir of dirs) files.push(...(await walk(dir)));
    return files;
  };

  const all = await walk('');

  const images = all
    .filter((obj) => obj.name && IMAGE_EXT.test(obj.name))
    .map((obj) => ({
      name: obj.name,
      url: db.storage.from(BUCKET).getPublicUrl(obj.name).data.publicUrl,
      size: obj.metadata?.size ?? null,
      updated_at: obj.updated_at ?? null,
    }))
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

  return NextResponse.json({ images });
}