'use client';
import React from 'react';
import { Brain, UserRound, ShoppingBag, Briefcase } from 'lucide-react';

// Shortcut chips for the four primary actions.
const CATS = [
  { icon: Brain, label: 'Tes Gratis', href: '/tes-gratis' },
  { icon: ShoppingBag, label: 'Beli Paket', href: '/paket' },
  { icon: Briefcase, label: 'Pasang Lowongan', href: '/employer/register' },
  { icon: UserRound, label: 'Member', href: '/member/register' },
];

export default function CategoryChips() {
  return (
    <div className="chips">
      <div className="container">
        {CATS.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.label} href={c.href} className="chip">
              <Icon size={15} strokeWidth={2} />
              <span>{c.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
