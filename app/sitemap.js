import { umpData } from '../lib/ump-data';
import { supabase } from '../lib/supabase';
import { postPath } from '../lib/post-url';

const BASE_URL = 'https://www.bekasikerja.id';

export default async function sitemap() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,type,created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  const postPaths = (posts || []).map((post) => ({
    url: `${BASE_URL}${postPath(post.type, post)}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: post.type === 'job' ? 0.8 : 0.7,
  }));
  const umpPaths = umpData.map((item) => ({
    url: `${BASE_URL}/ump/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/lowongan`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/tes-gratis`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/paket`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/cv-builder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/psikotes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/employer/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ump-indonesia-2026`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/umk-jawa-tengah-2026`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/umk-jawa-timur-2026`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/umk-banten-2026`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ump-dki-jakarta-2026`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...postPaths,
    ...umpPaths,
  ];
}
