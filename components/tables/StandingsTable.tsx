import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TeamStanding {
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string;
    isUserClub?: boolean;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsDiff: number;
  points: number;
  zoneDescription?: "Libertadores" | "Sudamericana" | "Descenso" | null;
}

export interface StandingsTableProps {
  standings: TeamStanding[];
  leagueName: string;
}

export function StandingsTable({ standings, leagueName }: StandingsTableProps) {
  const getZoneBorderColor = (desc?: string | null) => {
    switch (desc) {
      case "Libertadores":
        return "border-l-4 border-l-[#1FE07A]"; // Verde copa principal
      case "Sudamericana":
        return "border-l-4 border-l-[#38BDF8]"; // Celeste copa secundaria
      case "Descenso":
        return "border-l-4 border-l-[#EF4444]"; // Rojo descenso
      default:
        return "border-l-4 border-l-transparent";
    }
  };

  return (
    <div className="rounded-2xl bg-[#11171F] border border-[rgba(255,255,255,0.06)] overflow-hidden">
      {/* Cabecera */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-[#F8FAFC]">
          Tabla de Posiciones · {leagueName}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1FE07A]" /> Libertadores
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Sudamericana
          </span>
        </div>
      </div>

      {/* Tabla con scroll horizontal en caso de ser necesario en pantallas pequeñas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#64748B] border-b border-[rgba(255,255,255,0.04)] bg-[#0A0E13]/40">
              <th className="py-2.5 px-3 font-semibold text-center w-8">#</th>
              <th className="py-2.5 px-2 font-semibold">Club</th>
              <th className="py-2.5 px-2 font-semibold text-center w-8">PJ</th>
              <th className="py-2.5 px-2 font-semibold text-center w-8">G</th>
              <th className="py-2.5 px-2 font-semibold text-center w-8">E</th>
              <th className="py-2.5 px-2 font-semibold text-center w-8">P</th>
              <th className="py-2.5 px-2 font-semibold text-center w-10">DIF</th>
              <th className="py-2.5 px-3 font-bold text-center w-12 text-[#F8FAFC]">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)] font-mono tabular-nums">
            {standings.map((row) => {
              const isUser = row.team.isUserClub;
              return (
                <tr
                  key={row.team.id}
                  className={cn(
                    "transition-colors",
                    getZoneBorderColor(row.zoneDescription),
                    isUser
                      ? "bg-[#1FE07A]/10 font-medium text-[#F8FAFC] shadow-sm"
                      : "hover:bg-[rgba(255,255,255,0.02)] text-[#CBD5E1]"
                  )}
                >
                  <td className="py-2.5 px-3 text-center text-[#94A3B8] font-bold">
                    {row.rank}
                  </td>
                  <td className="py-2.5 px-2 font-sans font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <Image
                          src={row.team.logo}
                          alt={row.team.name}
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                      <span className={cn("truncate max-w-[130px]", isUser && "font-bold text-[#1FE07A]")}>
                        {row.team.name}
                      </span>
                      {isUser && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#1FE07A] text-[#0A0E13] font-bold uppercase font-sans">
                          Tú
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-[#94A3B8]">{row.played}</td>
                  <td className="py-2.5 px-2 text-center text-[#94A3B8]">{row.won}</td>
                  <td className="py-2.5 px-2 text-center text-[#94A3B8]">{row.drawn}</td>
                  <td className="py-2.5 px-2 text-center text-[#94A3B8]">{row.lost}</td>
                  <td className="py-2.5 px-2 text-center text-[#94A3B8]">
                    {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-sm text-[#F8FAFC]">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
