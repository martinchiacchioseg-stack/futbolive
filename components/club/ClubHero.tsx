"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Trophy, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormResult = "W" | "D" | "L";

export interface ClubHeroProps {
  club: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    primaryColor?: string; // Hex derivado del escudo
    tablePosition: number;
    tablePoints: number;
    leagueName: string;
    recentForm: readonly FormResult[] | FormResult[]; // Últimos 5 partidos
    nextMatch: {
      opponentName: string;
      opponentLogo: string;
      dateIso: string; // ISO date string
      isHome: boolean;
      competition: string;
    };
  };
}

export function ClubHero({ club }: ClubHeroProps) {
  // Cuenta regresiva simple hacia el próximo partido
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 28,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const primaryColor = club.primaryColor || "#1E2833";

  return (
    <section className="relative overflow-hidden rounded-3xl p-5 border border-[rgba(255,255,255,0.08)] shadow-2xl">
      {/* Fondo con degradado derivado del color del club */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${primaryColor} 0%, rgba(10, 14, 19, 0.95) 75%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E13] via-[#0A0E13]/60 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 space-y-5">
        {/* Fila superior: Escudo, Nombre y Posición */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-2xl bg-[#172029]/80 border border-[rgba(255,255,255,0.12)] p-2 shadow-lg backdrop-blur-sm flex items-center justify-center">
              {club.logo ? (
                <Image
                  src={club.logo}
                  alt={club.name}
                  width={52}
                  height={52}
                  className="object-contain"
                />
              ) : (
                <Shield className="w-8 h-8 text-[#1FE07A]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#1FE07A] uppercase tracking-wider">
                  Mi Club
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="text-xs text-[#94A3B8]">{club.leagueName}</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#F8FAFC] tracking-tight">
                {club.name}
              </h2>
            </div>
          </div>

          {/* Badge Posición en Tabla */}
          <div className="text-right bg-[#172029]/80 border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-end gap-1 text-[#F59E0B] text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>#{club.tablePosition}</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-medium">
              <span className="text-[#F8FAFC] font-bold tabular-nums">{club.tablePoints}</span> pts
            </div>
          </div>
        </div>

        {/* Forma reciente */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-[#94A3B8]">Forma reciente</span>
          <div className="flex items-center gap-1.5">
            {club.recentForm.map((result, idx) => {
              const config = {
                W: { label: "G", bg: "bg-[#1FE07A]/20 text-[#1FE07A] border-[#1FE07A]/40" },
                D: { label: "E", bg: "bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/30" },
                L: { label: "P", bg: "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40" },
              }[result];

              return (
                <span
                  key={idx}
                  className={cn(
                    "w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center border",
                    config.bg
                  )}
                >
                  {config.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Tarjeta Próximo Partido con Cuenta Regresiva */}
        <div className="rounded-2xl bg-[#11171F]/90 border border-[rgba(255,255,255,0.08)] p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2.5 pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#1FE07A]" />
              Próximo partido · {club.nextMatch.competition}
            </span>
            <span className="text-[11px] font-semibold text-[#CBD5E1]">
              {club.nextMatch.isHome ? "Local" : "Visitante"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="relative w-8 h-8 rounded-full bg-[#172029] p-1 flex items-center justify-center flex-shrink-0">
                <Image
                  src={club.nextMatch.opponentLogo}
                  alt={club.nextMatch.opponentName}
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </div>
              <div className="truncate">
                <span className="text-xs text-[#64748B] block">vs Rival</span>
                <span className="text-sm font-bold text-[#F8FAFC] truncate block">
                  {club.nextMatch.opponentName}
                </span>
              </div>
            </div>

            {/* Contador con números que no saltan */}
            <div className="flex items-center gap-1 bg-[#0A0E13]/80 px-2.5 py-1.5 rounded-xl border border-[rgba(255,255,255,0.06)] font-mono text-xs tabular-nums text-[#1FE07A] font-bold">
              <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span className="text-[#64748B]">:</span>
              <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span className="text-[#64748B]">:</span>
              <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
