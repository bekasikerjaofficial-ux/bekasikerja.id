import { getPublicPost } from '../../../lib/public-post';

export async function generateMetadata({ params }) {
  const post = await getPublicPost(params?.id, 'news');
  const title = post?.title || 'Berita dan Tips Karier BekasiKerja.id';
  const description = post?.content
    ? String(post.content).replace(/\\+n/g, ' ').replace(/[#*_]/g, '').replace(/\s+/g, ' ').trim().slice(0, 155)
    : 'Berita ketenagakerjaan, UMP, UMK, dan tips karier terbaru.';
  const image = post?.image_url || 'https://www.bekasikerja.id/logo.png';
  const canonical = post?.id ? `https://www.bekasikerja.id/artikel/${String(params.id)}` : 'https://www.bekasikerja.id/ump-indonesia-2026';
  return {
    title: `${title} | BekasiKerja.id`,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'article', images: [{ url: image, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function ArticleDetailLayout({ children }) {
  return children;
}
