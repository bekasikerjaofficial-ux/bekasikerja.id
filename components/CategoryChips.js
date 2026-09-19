'use client';
import React from 'react';
import { Factory, Briefcase, Wrench, Package, Truck, BookOpen, Brain, UserRound, ShoppingBag } from 'lucide-react';

// Shortcut chips for key destinations and job categories.
const CATS = [
  { icon: Brain, label: 'Tes Gratis', href: '/tes-gratis' },
  { icon: UserRound, label: 'Member', href: '/member/register' },
  { icon: ShoppingBag, label: 'Beli Paket', href: '/paket' },
  { icon: Factory, label: 'Manufaktur', href: '/#lowongan' },
  { icon: Briefcase, label: 'Admin', href: '/#lowongan' },
  { icon: Wrench, label: 'Engineering', href: '/#lowongan' },
  { icon: Package, label: 'Gudang', href: '/#lowongan' },
  { icon: Truck, label: 'Logistik', href: '/#lowongan' },
  { icon: BookOpen, label: 'Tips Karir', href: '/#lifestyle' },
  { icon: Brain, label: 'Psikotes', href: '/psikotes' },
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
