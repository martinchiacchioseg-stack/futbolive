"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNav, NavTab } from "@/components/navigation/BottomNav";
import { MatchCard } from "@/components/matches/MatchCard";
import { ClubHero, FormResult } from "@/components/club/ClubHero";
import { StandingsTable, TeamStanding } from "@/components/tables/StandingsTable";
import { BracketView } from "@/components/cup/BracketView";
import { Flame, Sparkles, Building2, ShieldCheck, Filter } from "lucide-react";
import { SaasStore } from "@/lib/saas-store";
import { AuthUser, Tenant } from "@/types/saas";
import { POPULAR_CLUBS, AVAILABLE_TOURNAMENTS } from "@/lib/constants";
import { LoginModal } from "@/components/auth/LoginModal";
import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { SuperAdminDashboard } from "@/components/admin/SuperAdminDashboard";

const INITIAL_STANDINGS: TeamStanding[] = [
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

const INITIAL_BRACKET = [
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  // Modales
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Simulación
  const [simulatedGoal, setSimulatedGoal] = useState<string | null>(null);

  const refreshSession = () => {
    const user = SaasStore.getCurrentUser();
    setCurrentUser(user);
    if (user?.tenantId) {
      const tenants = SaasStore.getTenants();
      const t = tenants.find((item) => item.id === user.tenantId);
      setCurrentTenant(t || null);
    } else {
      setCurrentTenant(null);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const triggerGoal = () => {
    const clubName = currentUser?.favoriteClub?.name || "Boca Juniors";
    setSimulatedGoal(clubName);
    setTimeout(() => {
      setSimulatedGoal(null);
    }, 4500);
  };

  // Determinar torneos permitidos para el usuario actual
  const allowedTournamentIds = currentTenant
    ? currentTenant.allowedTournaments
    : AVAILABLE_TOURNAMENTS.map((t) => t.id);

  const canShowLibertadores = allowedTournamentIds.includes("copa_libertadores");
  const canShowLiga = allowedTournamentIds.includes("liga_profesional");

  // Configuración del Club Hero reactiva al cuadro del usuario
  const userClub = currentUser?.favoriteClub || POPULAR_CLUBS[0];
  const activeClubHeroData = {
    id: userClub.id,
    name: userClub.name,
    shortName: userClub.shortName,
    logo: userClub.logo,
    primaryColor: userClub.primaryColor,
    tablePosition: 2,
    tablePoints: 34,
    leagueName: userClub.leagueName,
    recentForm: ["W", "W", "D", "W", "L"] as FormResult[],
    nextMatch: {
      opponentName: userClub.id === "boca" ? "Racing Club" : "Boca Juniors",
      opponentLogo: userClub.id === "boca"
        ? "https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg"
        : "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png",
      dateIso: "2026-10-22T21:30:00Z",
      isHome: true,
      competition: "Liga Profesional",
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0E13] text-[#F8FAFC] pb-24 md:pb-12">
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        onLogout={() => {
          SaasStore.logout();
          refreshSession();
        }}
      />

      {/* Banner de Negocio SaaS Activo */}
      {currentTenant && (
        <div className="bg-[#11171F] border-b border-[rgba(255,255,255,0.06)] px-4 py-2 text-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#1FE07A]" />
              <span className="text-[#CBD5E1] font-semibold">{currentTenant.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B]">
                {currentTenant.allowedTournaments.length} torneos asignados
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FE07A]" />
            </div>
          </div>
        </div>
      )}

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
        {/* Banner de Control Rápido de Demostración */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#172029]/80 border border-[#1FE07A]/30">
          <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
            <Sparkles className="w-4 h-4 text-[#1FE07A] flex-shrink-0" />
            <span>
              {currentUser ? (
                <>Conectado como: <strong>{currentUser.email}</strong> ({currentUser.favoriteClub ? `Hincha de ${currentUser.favoriteClub.name}` : "Perfil pendiente"})</>
              ) : (
                <>Sesión de demostración. Puedes ingresar como SuperAdmin o como cliente SaaS.</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAdminDashboard(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#11171F] border border-[rgba(255,255,255,0.1)] text-[#1FE07A] text-xs font-bold hover:bg-[#1E2833] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel SuperAdmin</span>
            </button>

            <button
              onClick={triggerGoal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] text-xs font-bold hover:brightness-110 active:scale-95 transition-transform"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>¡Simular Gol!</span>
            </button>
          </div>
        </div>

        {/* 1. HÉROE DEL CLUB PERSONALIZADO */}
        <ClubHero club={activeClubHeroData} />

        {/* 2. PARTIDOS FILTRADOS SEGÚN EL NEGOCIO SAAS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1FE07A] animate-live-dot" />
              <h3 className="font-display font-bold text-lg text-[#F8FAFC] tracking-tight">
                Partidos en Vivo & Próximos
              </h3>
            </div>
            {currentTenant && (
              <span className="text-[11px] text-[#1FE07A] flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Filtrado por {currentTenant.name}</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Partido En Vivo (Libertadores) */}
            {canShowLibertadores && (
              <MatchCard
                id="match-1"
                competition={{
                  name: "CONMEBOL Libertadores · Cuartos Vuelta",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ-escudo-2020.png",
                }}
                homeTeam={{
                  name: userClub.name,
                  shortName: userClub.shortName,
                  logo: userClub.logo,
                  score: simulatedGoal ? 2 : 1,
                }}
                awayTeam={{
                  name: "Palmeiras",
                  shortName: "PAL",
                  logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
                  score: 1,
                }}
                status="live"
                minute={73}
                isUserFavorite={true}
                recentGoalTeam={simulatedGoal || undefined}
              />
            )}

            {/* Partido Programado (Liga Profesional) */}
            {canShowLiga && (
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
            )}

            {/* Partido Finalizado (Liga Profesional) */}
            {canShowLiga && (
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
            )}

            {!canShowLiga && !canShowLibertadores && (
              <div className="p-8 text-center rounded-2xl bg-[#11171F] border border-[rgba(255,255,255,0.06)] text-xs text-[#94A3B8]">
                Tu negocio no tiene torneos activos seleccionados por el Superadministrador.
              </div>
            )}
          </div>
        </section>

        {/* 3. TABLA DE POSICIONES (Si tiene habilitada la liga) */}
        {canShowLiga && (
          <section>
            <StandingsTable standings={INITIAL_STANDINGS} leagueName="Liga Profesional Argentina" />
          </section>
        )}

        {/* 4. CUADRO DE LLAVES (Si tiene habilitada la copa) */}
        {canShowLibertadores && (
          <section>
            <BracketView cupName="Copa CONMEBOL Libertadores" rounds={INITIAL_BRACKET} />
          </section>
        )}
      </main>

      {/* Navegación móvil ergonómica */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* MODAL DE LOGIN */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          refreshSession();
        }}
      />

      {/* MODAL DE PRIMER INGRESO (CAMBIO DE CONTRASEÑA Y PERFIL OBLIGATORIO) */}
      {currentUser && (currentUser.mustChangePassword || !currentUser.profileCompleted) && (
        <OnboardingModal
          user={currentUser}
          onCompleted={(updatedUser) => {
            refreshSession();
          }}
        />
      )}

      {/* DASHBOARD DE SUPERADMINISTRADOR */}
      {showAdminDashboard && (
        <SuperAdminDashboard
          onClose={() => setShowAdminDashboard(false)}
          onRefreshData={() => {
            refreshSession();
          }}
        />
      )}
    </div>
  );
}
