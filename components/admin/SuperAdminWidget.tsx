"use client";

import React from "react";
import { Activity, Users, Database, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuperAdminWidgetProps {
  requestsUsed: number;
  requestsLimit: number;
  activeUsers: number;
  cacheHitRatio: number;
}

export function SuperAdminWidget({
  requestsUsed = 780,
  requestsLimit = 1000,
  activeUsers = 1420,
  cacheHitRatio = 94.2,
}: Partial<SuperAdminWidgetProps>) {
  const percentage = Math.min(100, Math.round((requestsUsed / requestsLimit) * 100));

  // Determinar color según cuota: verde (<70%), ámbar (70-90%), rojo (>90%)
  const quotaColor =
    percentage > 90
      ? { text: "text-[#EF4444]", stroke: "#EF4444", bg: "bg-[#EF4444]/10", label: "Crítica" }
      : percentage > 70
      ? { text: "text-[#F59E0B]", stroke: "#F59E0B", bg: "bg-[#F59E0B]/10", label: "Media" }
      : { text: "text-[#1FE07A]", stroke: "#1FE07A", bg: "bg-[#1FE07A]/10", label: "Óptima" };

  // Parámetros del SVG circular
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl bg-[#11171F] border border-[rgba(255,255,255,0.08)] p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-[11px] font-bold text-[#1FE07A] uppercase tracking-wider block">
            Infraestructura & Consumo
          </span>
          <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
            Panel de Operaciones SuperAdmin
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#172029] text-[#94A3B8] font-mono border border-[rgba(255,255,255,0.06)]">
          API v3 Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Medidor Circular de Cuota Diaria */}
        <div className="flex items-center gap-4 bg-[#172029]/70 rounded-xl p-3 border border-[rgba(255,255,255,0.04)]">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#1E2833]"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={quotaColor.stroke}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={cn("text-sm font-black font-mono tabular-nums leading-none", quotaColor.text)}>
                {percentage}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#94A3B8] block">Cuota diaria API</span>
            <div className="font-mono text-sm font-bold text-[#F8FAFC] tabular-nums">
              {requestsUsed} / {requestsLimit}
            </div>
            <span className={cn("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1", quotaColor.bg, quotaColor.text)}>
              Estado {quotaColor.label}
            </span>
          </div>
        </div>

        {/* Métrica Cache Hit */}
        <div className="bg-[#172029]/70 rounded-xl p-3.5 border border-[rgba(255,255,255,0.04)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1FE07A]/10 border border-[#1FE07A]/20 flex items-center justify-center text-[#1FE07A]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#94A3B8]">Eficiencia de Caché</span>
            <div className="text-lg font-bold font-mono text-[#F8FAFC] tabular-nums">
              {cacheHitRatio}%
            </div>
            <span className="text-[10px] text-[#1FE07A] font-medium">99.4% ahorro llamadas</span>
          </div>
        </div>

        {/* Métrica Usuarios */}
        <div className="bg-[#172029]/70 rounded-xl p-3.5 border border-[rgba(255,255,255,0.04)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#94A3B8]">Usuarios Activos</span>
            <div className="text-lg font-bold font-mono text-[#F8FAFC] tabular-nums">
              {activeUsers.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#94A3B8]">Conexiones websocket OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
