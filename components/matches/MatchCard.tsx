"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type MatchStatus = "live" | "scheduled" | "finished";

export interface MatchProps {
  id: string;
  competition: {
    name: string;
    logo?: string;
  };
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    color?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    color?: string;
  };
  status: MatchStatus;
  minute?: number;
  scheduledTime?: string; // Formato arg: "Jue 22 · 21:30"
  isUserFavorite?: boolean;
  recentGoalTeam?: string; // Nombre del equipo si acaba de anotar
}

export function MatchCard({
  competition,
  homeTeam,
  awayTeam,
  status,
  minute,
  scheduledTime,
  isUserFavorite = false,
  recentGoalTeam,
}: MatchProps) {
  const [goalAlert, setGoalAlert] = useState<string | null>(recentGoalTeam || null);
  const isLive = status === "live";
  const isFinished = status === "finished";

  return (
    <motion.article
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative rounded-2xl p-4 transition-all duration-300",
        "bg-[#11171F] border",
        isLive
          ? "border-[#1FE07A]/50 shadow-[0_0_20px_rgba(31,224,122,0.12)] ring-1 ring-[#1FE07A]/30"
          : isUserFavorite
          ? "border-[#38BDF8]/40 bg-gradient-to-b from-[#172029] to-[#11171F]"
          : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]",
        goalAlert && "flash-goal"
      )}
    >
      {/* Notificación flotante de Gol */}
      <AnimatePresence>
        {goalAlert && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FE07A] text-[#0A0E13] text-xs font-black tracking-wide shadow-lg shadow-[#1FE07A]/30"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>¡GOL DE {goalAlert.toUpperCase()}!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabecera de la tarjeta: Competencia y Estado */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)] mb-3 text-xs">
        <div className="flex items-center gap-2">
          {competition.logo ? (
            <div className="relative w-4 h-4 rounded-full overflow-hidden bg-[rgba(255,255,255,0.08)] flex-shrink-0">
              <Image
                src={competition.logo}
                alt={competition.name}
                fill
                sizes="16px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#1FE07A]" />
          )}
          <span className="font-medium text-[#94A3B8] truncate max-w-[170px]">
            {competition.name}
          </span>
        </div>

        {/* Chip de estado */}
        <div className="flex items-center gap-1.5">
          {isLive && (
            <div className="flex items-center gap-1.5 bg-[#1FE07A]/10 text-[#1FE07A] border border-[#1FE07A]/25 px-2 py-0.5 rounded-full font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#1FE07A] animate-live-dot" />
              <span className="tabular-nums font-mono">{minute}&apos;</span>
            </div>
          )}

          {status === "scheduled" && (
            <span className="text-[#94A3B8] font-medium text-[11px] tabular-nums">
              {scheduledTime || "Por jugar"}
            </span>
          )}

          {isFinished && (
            <span className="text-[#64748B] font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#172029] rounded">
              Final
            </span>
          )}

          {isUserFavorite && (
            <Star className="w-3.5 h-3.5 text-[#38BDF8] fill-[#38BDF8]/20 ml-1" />
          )}
        </div>
      </div>

      {/* Contenido Central: Equipos y Marcador */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-1">
        {/* Local */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full bg-[#172029] border border-[rgba(255,255,255,0.08)] flex items-center justify-center p-1.5 flex-shrink-0">
            {homeTeam.logo ? (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={36}
                height={36}
                className="object-contain max-h-8"
              />
            ) : (
              <span className="text-xs font-bold text-[#94A3B8]">
                {homeTeam.shortName.slice(0, 3)}
              </span>
            )}
          </div>
          <div className="truncate">
            <span className="block font-semibold text-sm text-[#F8FAFC] truncate">
              {homeTeam.name}
            </span>
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider">
              Local
            </span>
          </div>
        </div>

        {/* Marcador Central Tabular */}
        <div className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-[#172029]/80 border border-[rgba(255,255,255,0.05)] min-w-[76px]">
          {isLive || isFinished ? (
            <div className="flex items-center gap-2 font-display text-2xl font-black tabular-nums tracking-tight">
              <span className={cn(isLive ? "text-[#F8FAFC]" : "text-[#CBD5E1]")}>
                {homeTeam.score ?? 0}
              </span>
              <span className="text-[#475569] text-base font-sans font-light">-</span>
              <span className={cn(isLive ? "text-[#F8FAFC]" : "text-[#CBD5E1]")}>
                {awayTeam.score ?? 0}
              </span>
            </div>
          ) : (
            <div className="text-xs text-[#94A3B8] font-medium font-sans">
              VS
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex items-center justify-end gap-3 text-right">
          <div className="truncate">
            <span className="block font-semibold text-sm text-[#F8FAFC] truncate">
              {awayTeam.name}
            </span>
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider">
              Visita
            </span>
          </div>
          <div className="relative w-11 h-11 rounded-full bg-[#172029] border border-[rgba(255,255,255,0.08)] flex items-center justify-center p-1.5 flex-shrink-0">
            {awayTeam.logo ? (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={36}
                height={36}
                className="object-contain max-h-8"
              />
            ) : (
              <span className="text-xs font-bold text-[#94A3B8]">
                {awayTeam.shortName.slice(0, 3)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
