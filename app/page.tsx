"use client";

import React, { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNav, NavTab } from "@/components/navigation/BottomNav";
import { MatchCard } from "@/components/matches/MatchCard";
import { ClubHero, FormResult } from "@/components/club/ClubHero";
import { StandingsTable, TeamStanding } from "@/components/tables/StandingsTable";
import { BracketView } from "@/components/cup/BracketView";
import { SuperAdminWidget } from "@/components/admin/SuperAdminWidget";
import { Flame, Sparkles } from "lucide-react";

// Datos de prueba deportivos con estética de producto comercial
const MOCK_CLUB = {
  id: "boca",
  name: "Boca Juniors",
  shortName: "BOC",
  logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png",
  primaryColor: "#0D2240", // Azul oro profundo
  tablePosition: 2,
  tablePoints: 34,
  leagueName: "Liga Profesional Argentina",
  recentForm: ["W", "W", "D", "W", "L"] as const,
  nextMatch: {
    opponentName: "Racing Club",
    opponentLogo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg",
    dateIso: "2026-10-22T21:30:00Z",
    isHome: true,
    competition: "Liga Profesional",
  },
};

const MOCK_STANDINGS: TeamStanding[] = [
  {
    rank: 1,
    team: { id: "river", name: "River Plate", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg" },
    played: 16, won: 11, drawn: 3, lost: 2, goalsDiff: 18, points: 36, zoneDescription: "Libertadores"
  },
  {
    rank: 2,
    team: { id: "boca", name: "Boca Juniors", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png", isUserClub: true },
    played: 16, won: 10, drawn: 4, lost: 2, goalsDiff: 14, points: 34, zoneDescription: "Libertadores"
  },
  {
    rank: 3,
    team: { id: "racing", name: "Racing Club", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg" },
    played: 16, won: 9, drawn: 4, lost: 3, goalsDiff: 11, points: 31, zoneDescription: "Sudamericana"
  },
  {
    rank: 4,
    team: { id: "velez", name: "Vélez Sarsfield", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg" },
    played: 16, won: 8, drawn: 5, lost: 3, goalsDiff: 7, points: 29, zoneDescription: "Sudamericana"
  },
  {
    rank: 27,
    team: { id: "tigre", name: "Tigre", logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Escudo_del_Club_Atl%C3%A9tico_Tigre.svg" },
    played: 16, won: 2, drawn: 4, lost: 10, goalsDiff: -13, points: 10, zoneDescription: "Descenso"
  },
];

const MOCK_BRACKET = [
  {
    name: "Cuartos de Final",
    matches: [
      {
        id: "qf1",
        round: "Cuartos",
        teamA: { name: "Boca Juniors", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png", leg1: 2, leg2: 1, aggregate: 3, isWinner: true, isUserClub: true },
        teamB: { name: "Talleres", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Escudo_del_Club_Atl%C3%A9tico_Talleres_%28C%C3%B3rdoba%29.svg", leg1: 0, leg2: 1, aggregate: 1, isWinner: false },
      },
      {
        id: "qf2",
        round: "Cuartos",
        teamA: { name: "Flamengo", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg", leg1: 1, leg2: 2, aggregate: 3, isWinner: true },
        teamB: { name: "Peñarol", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Escudo_del_Club_Atl%C3%A9tico_Pe%C3%B1arol.svg", leg1: 1, leg2: 0, aggregate: 1, isWinner: false },
      },
    ],
  },
  {
    name: "Semifinal",
    matches: [
      {
        id: "sf1",
        round: "Semifinal",
        teamA: { name: "Boca Juniors", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png", leg1: 0, leg2: 0, aggregate: 0, isWinner: false, isUserClub: true },
        teamB: { name: "Flamengo", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg", leg1: 0, leg2: 0, aggregate: 0, isWinner: false },
      },
    ],
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [simulatedGoal, setSimulatedGoal] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const triggerGoal = () => {
    setSimulatedGoal("Boca Juniors");
    setTimeout(() => {
      setSimulatedGoal(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0E13] text-[#F8FAFC] pb-24 md:pb-12">
      <Header onOpenAdmin={() => setShowAdminPanel(!showAdminPanel)} />

      {/* Selector de Fechas / Filtro Rápido */}
      <section className="border-b border-[rgba(255,255,255,0.06)] bg-[#0A0E13]/60 py-2.5 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center gap-2">
          {["Ayer 19", "HOY 20", "Mañana 21", "Jue 22", "Vie 23", "Sáb 24"].map((date, i) => (
            <button
              key={date}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                i === 1
                  ? "bg-[#1FE07A] text-[#0A0E13] shadow-[0_0_12px_rgba(31,224,122,0.35)]"
                  : "bg-[#11171F] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.05)]"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        {/* Banner de simulación interactiva */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#172029]/80 border border-[#1FE07A]/30">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-[#1FE07A]" />
            <span className="text-[#CBD5E1]">Simulación de microinteracción:</span>
          </div>
          <button
            onClick={triggerGoal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1FE07A] text-[#0A0E13] text-xs font-bold hover:brightness-110 active:scale-95 transition-transform"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            ¡Simular Gol en Vivo!
          </button>
        </div>

        {/* Panel de administración si está activo */}
        {showAdminPanel && (
          <section className="animate-in fade-in slide-in-from-top-2 duration-200">
            <SuperAdminWidget requestsUsed={820} requestsLimit={1000} activeUsers={3410} cacheHitRatio={95.8} />
          </section>
        )}

        {/* 1. HÉROE DEL CLUB */}
        <ClubHero club={MOCK_CLUB} />

        {/* 2. PARTIDOS DESTACADOS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1FE07A] animate-live-dot" />
              <h3 className="font-display font-bold text-lg text-[#F8FAFC] tracking-tight">
                Partidos en Vivo & Próximos
              </h3>
            </div>
            <span className="text-xs text-[#94A3B8]">Zona horaria: Argentina (GMT-3)</span>
          </div>

          <div className="space-y-3">
            {/* Partido En Vivo */}
            <MatchCard
              id="match-1"
              competition={{
                name: "Copa Libertadores · Cuartos Vuelta",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png",
              }}
              homeTeam={{
                name: "Boca Juniors",
                shortName: "BOC",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png",
                score: simulatedGoal ? 2 : 1,
              }}
              awayTeam={{
                name: "Palmeiras",
                shortName: "PAL",
                logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
                score: 1,
              }}
              status="live"
              minute={67}
              isUserFavorite={true}
              recentGoalTeam={simulatedGoal || undefined}
            />

            {/* Partido Programado */}
            <MatchCard
              id="match-2"
              competition={{
                name: "Liga Profesional · Fecha 17",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg",
              }}
              homeTeam={{
                name: "River Plate",
                shortName: "RIV",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg",
              }}
              awayTeam={{
                name: "Independiente",
                shortName: "IND",
                logo: "https://upload.wikimedia.org/wikipedia/commons/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg",
              }}
              status="scheduled"
              scheduledTime="Jue 22 · 21:30"
            />

            {/* Partido Finalizado */}
            <MatchCard
              id="match-3"
              competition={{
                name: "Liga Profesional · Fecha 16",
              }}
              homeTeam={{
                name: "San Lorenzo",
                shortName: "SLO",
                logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg",
                score: 0,
              }}
              awayTeam={{
                name: "Huracán",
                shortName: "HUR",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Huracan_logo.svg",
                score: 0,
              }}
              status="finished"
            />
          </div>
        </section>

        {/* 3. TABLA DE POSICIONES */}
        <section>
          <StandingsTable standings={MOCK_STANDINGS} leagueName="Liga Profesional" />
        </section>

        {/* 4. CUADRO DE LLAVES (COPAS ELIMINATORIAS) */}
        <section>
          <BracketView cupName="Copa Libertadores 2026" rounds={MOCK_BRACKET} />
        </section>
      </main>

      {/* Navegación móvil ergonómica */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
