'use client';
import React, { useEffect, useState } from 'react';
import { Brain, ShoppingBag, Briefcase, UserRound, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Shortcut rail for the four primary actions (situsively under the header).
const CATS = [
  { id: 'tes', icon: Brain, label: 'Tes Gratis', href: '/tes-gratis' },
  { id: 'paket', icon: ShoppingBag, label: 'Beli Paket', href: '/paket' },
  { id: 'employer', icon: Briefcase, label: 'Pasang Lowongan', href: '/employer/register' },
];

export default function CategoryChips() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (alive) setUser(data.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Member chip is auth-aware: dashboard when signed in, login otherwise.
  const memberChip = user
    ? { id: 'member', icon: LayoutDashboard, label: 'Dashboard', href: '/member/dashboard' }
    : { id: 'member', icon: UserRound, label: 'Member', href: '/member/login' };

  const items = [...CATS, memberChip];

  return (
    <nav className="chips" aria-label="Akses cepat">
      <div className="container chips-rail">
        {items.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.id} href={c.href} className="chip" aria-label={c.label}>
              <span className="chip-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="chip-label">{c.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
