"use client";

import React from "react";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { Bell, Search, ShieldCheck, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { AuthUser } from "@/types/saas";

interface HeaderProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export function Header({ currentUser, onOpenLogin, onOpenAdmin, onLogout }: HeaderProps) {
  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0E13]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón de acceso a SuperAdmin */}
          {(isSuperAdmin || !currentUser) && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#172029] hover:bg-[#1E2833] border border-[#1FE07A]/30 text-xs font-semibold text-[#1FE07A] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Consola SuperAdmin</span>
            </button>
          )}

          {/* Información del usuario autenticado */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-[#11171F] border border-[rgba(255,255,255,0.08)] py-1 px-2.5 rounded-full">
              {currentUser.favoriteClub && (
                <div className="relative w-5 h-5 flex-shrink-0">
                  <Image
                    src={currentUser.favoriteClub.logo}
                    alt={currentUser.favoriteClub.name}
                    fill
                    sizes="20px"
                    className="object-contain"
                  />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[#F8FAFC] leading-none">
                  {currentUser.name || currentUser.email.split("@")[0]}
                </span>
                <span className="text-[10px] text-[#94A3B8] leading-none">
                  {currentUser.tenantName || (isSuperAdmin ? "SuperAdmin" : "Usuario")}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="w-6 h-6 rounded-full hover:bg-[#172029] flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1FE07A] text-[#0A0E13] font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(31,224,122,0.25)]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}

          <button
            aria-label="Buscar partido o equipo"
            className="w-8 h-8 rounded-full bg-[#11171F] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
