"use client";

import React from "react";
import { Home, CalendarDays, Shield, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab = "home" | "matches" | "myclub" | "standings" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "matches", label: "Partidos", icon: CalendarDays },
    { id: "myclub", label: "Mi Club", icon: Shield },
    { id: "standings", label: "Posiciones", icon: Trophy },
    { id: "profile", label: "Perfil", icon: User },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0E13]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)] px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as NavTab)}
              type="button"
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all select-none",
                isActive ? "text-[#1FE07A]" : "text-[#94A3B8] hover:text-[#CBD5E1]"
              )}
            >
              {/* Glow activo */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-[#1FE07A] shadow-[0_0_10px_#1FE07A]" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-[10px] mt-1 font-medium", isActive ? "font-bold text-[#F8FAFC]" : "text-[#64748B]")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
