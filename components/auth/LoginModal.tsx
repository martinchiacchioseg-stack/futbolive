"use client";

import React, { useState } from "react";
import { X, Lock, Mail, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { SaasStore } from "@/lib/saas-store";
import { AuthUser } from "@/types/saas";
import { Logo } from "@/components/brand/Logo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = SaasStore.login(email, password);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || "Credenciales inválidas");
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#11171F] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#172029] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <Logo size="lg" className="items-center" />
          <p className="text-xs text-[#94A3B8]">
            Ingreso al sistema multi-negocio FutboLive
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#CBD5E1]">Email / Usuario</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@negocio.com"
                className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#1FE07A]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#CBD5E1]">Contraseña</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#1FE07A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(31,224,122,0.3)]"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Accesos rápidos para probar la experiencia completa */}
        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block text-center">
            Accesos de Prueba Inmediatos
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo("superadmin@futbolive.com", "admin2026")}
              className="text-left p-2.5 rounded-xl bg-[#172029]/80 hover:bg-[#1E2833] border border-[rgba(255,255,255,0.05)] text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#1FE07A] block">Acceso SuperAdmin</span>
                <span className="text-[10px] text-[#94A3B8]">Gestión de negocios, cuentas y torneos</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#1FE07A]" />
            </button>

            <button
              type="button"
              onClick={() => fillQuickDemo("cliente@sportsbar.com", "clave123")}
              className="text-left p-2.5 rounded-xl bg-[#172029]/80 hover:bg-[#1E2833] border border-[#F59E0B]/30 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#F59E0B] block">Nuevo Usuario (Primer Ingreso)</span>
                <span className="text-[10px] text-[#94A3B8]">Dispara cambio de clave y perfil obligatorio</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
