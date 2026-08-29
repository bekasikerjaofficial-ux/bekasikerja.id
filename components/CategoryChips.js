'use client';
import React from 'react';
import { Factory, Briefcase, Wrench, Package, Truck, BookOpen, Brain } from 'lucide-react';

// Category chips — visual pill row (ornamen), klik scroll ke #lowongan
// (sesuai pilihan user: visual aja, bukan filter data live)
const CATS = [
  { icon: Factory, label: 'Manufaktur' },
  { icon: Briefcase, label: 'Admin' },
  { icon: Wrench, label: 'Engineering' },
  { icon: Package, label: 'Gudang' },
  { icon: Truck, label: 'Logistik' },
  { icon: BookOpen, label: 'Tips Karir' },
  { icon: Brain, label: 'Psikotes' },
];

export default function CategoryChips() {
  return (
    <div className="chips">
      <div className="container">
        {CATS.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.label} href="/#lowongan" className="chip">
              <Icon size={15} strokeWidth={2} />
              <span>{c.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
