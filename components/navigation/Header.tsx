"use client";

import React from "react";
import { Logo } from "@/components/brand/Logo";
import { Bell, Search, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenAdmin?: () => void;
  showAdminBadge?: boolean;
}

export function Header({ onOpenAdmin, showAdminBadge = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0E13]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-2">
          {showAdminBadge && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#172029] hover:bg-[#1E2833] border border-[rgba(255,255,255,0.08)] text-[11px] font-semibold text-[#94A3B8] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1FE07A]" />
              <span className="hidden sm:inline">SuperAdmin</span>
            </button>
          )}

          <button
            aria-label="Buscar partido o equipo"
            className="w-9 h-9 rounded-full bg-[#11171F] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            aria-label="Notificaciones"
            className="relative w-9 h-9 rounded-full bg-[#11171F] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1FE07A]" />
          </button>
        </div>
      </div>
    </header>
  );
}
