import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BracketMatch {
  id: string;
  round: string; // e.g. "Octavos", "Cuartos", "Semifinal", "Final"
  teamA: {
    name: string;
    logo: string;
    leg1?: number;
    leg2?: number;
    aggregate: number;
    penalties?: number;
    isWinner?: boolean;
    isUserClub?: boolean;
  };
  teamB: {
    name: string;
    logo: string;
    leg1?: number;
    leg2?: number;
    aggregate: number;
    penalties?: number;
    isWinner?: boolean;
    isUserClub?: boolean;
  };
}

export interface BracketViewProps {
  cupName: string;
  rounds: {
    name: string;
    matches: BracketMatch[];
  }[];
}

export function BracketView({ cupName, rounds }: BracketViewProps) {
  return (
    <div className="rounded-2xl bg-[#11171F] border border-[rgba(255,255,255,0.06)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-[#F8FAFC]">
          Cuadro Eliminatorio · {cupName}
        </h3>
        <span className="text-[11px] text-[#64748B]">Ida, Vuelta & Global</span>
      </div>

      {/* Contenedor con scroll horizontal fluido en móvil */}
      <div className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
        {rounds.map((round) => (
          <div
            key={round.name}
            className="flex-shrink-0 w-64 space-y-4 snap-start"
          >
            <div className="text-center font-display font-bold text-xs uppercase tracking-wider text-[#94A3B8] pb-1 border-b border-[rgba(255,255,255,0.06)]">
              {round.name}
            </div>

            <div className="space-y-4">
              {round.matches.map((match) => {
                const hasUserClub = match.teamA.isUserClub || match.teamB.isUserClub;

                return (
                  <div
                    key={match.id}
                    className={cn(
                      "rounded-xl p-3 border transition-all text-xs bg-[#172029]",
                      hasUserClub
                        ? "border-[#1FE07A]/60 shadow-[0_0_12px_rgba(31,224,122,0.15)] ring-1 ring-[#1FE07A]/30"
                        : "border-[rgba(255,255,255,0.08)]"
                    )}
                  >
                    {/* Equipo A */}
                    <div className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.04)]">
                      <div className="flex items-center gap-2 truncate">
                        <div className="relative w-5 h-5 flex-shrink-0">
                          <Image
                            src={match.teamA.logo}
                            alt={match.teamA.name}
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </div>
                        <span
                          className={cn(
                            "truncate font-medium",
                            match.teamA.isWinner ? "text-[#F8FAFC] font-bold" : "text-[#94A3B8]",
                            match.teamA.isUserClub && "text-[#1FE07A]"
                          )}
                        >
                          {match.teamA.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono tabular-nums text-right">
                        <span className="text-[10px] text-[#64748B]">
                          ({match.teamA.leg1 ?? 0}-{match.teamA.leg2 ?? 0})
                        </span>
                        <span
                          className={cn(
                            "font-bold px-1.5 py-0.5 rounded text-xs",
                            match.teamA.isWinner
                              ? "bg-[#1FE07A]/20 text-[#1FE07A]"
                              : "text-[#94A3B8]"
                          )}
                        >
                          {match.teamA.aggregate}
                        </span>
                      </div>
                    </div>

                    {/* Equipo B */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <div className="relative w-5 h-5 flex-shrink-0">
                          <Image
                            src={match.teamB.logo}
                            alt={match.teamB.name}
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </div>
                        <span
                          className={cn(
                            "truncate font-medium",
                            match.teamB.isWinner ? "text-[#F8FAFC] font-bold" : "text-[#94A3B8]",
                            match.teamB.isUserClub && "text-[#1FE07A]"
                          )}
                        >
                          {match.teamB.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono tabular-nums text-right">
                        <span className="text-[10px] text-[#64748B]">
                          ({match.teamB.leg1 ?? 0}-{match.teamB.leg2 ?? 0})
                        </span>
                        <span
                          className={cn(
                            "font-bold px-1.5 py-0.5 rounded text-xs",
                            match.teamB.isWinner
                              ? "bg-[#1FE07A]/20 text-[#1FE07A]"
                              : "text-[#94A3B8]"
                          )}
                        >
                          {match.teamB.aggregate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
