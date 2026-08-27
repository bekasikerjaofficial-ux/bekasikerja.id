'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NyosorIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/nyosor/login');
  }, [router]);
  return <div className="min-h-screen bg-slate-100" />;
}
