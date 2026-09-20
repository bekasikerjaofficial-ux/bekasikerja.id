import { getPublicPost } from '../../../lib/public-post';

export async function generateMetadata({ params }) {
  const post = await getPublicPost(params?.id, 'job');
  const title = post?.title || 'Lowongan Kerja Bekasi, Cikarang & Karawang';
  const description = post?.content
    ? String(post.content).replace(/\\+n/g, ' ').replace(/[#*_]/g, '').replace(/\s+/g, ' ').trim().slice(0, 155)
    : 'Temukan lowongan kerja terbaru di Bekasi, Cikarang, dan Karawang.';
  const image = post?.image_url || 'https://www.bekasikerja.id/logo.png';
  const canonical = post?.id ? `https://www.bekasikerja.id/loker/${String(params.id)}` : 'https://www.bekasikerja.id/lowongan';
  return {
    title: `${title} | BekasiKerja.id`,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', images: [{ url: image, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function JobDetailLayout({ children }) {
  return children;
}
