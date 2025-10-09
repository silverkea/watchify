/**
 * Header Component
 * Main navigation header with logo and theme toggle
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';

import { ThemeToggle } from '@/components/atoms/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Film className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-foreground">
              Watchify
            </h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}