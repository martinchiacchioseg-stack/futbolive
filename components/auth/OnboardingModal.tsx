"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Phone, User as UserIcon, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { POPULAR_CLUBS } from "@/lib/constants";
import { AuthUser, ClubOption } from "@/types/saas";
import { SaasStore } from "@/lib/saas-store";

interface OnboardingModalProps {
  user: AuthUser;
  onCompleted: (updatedUser: AuthUser) => void;
}

export function OnboardingModal({ user, onCompleted }: OnboardingModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(user.name || "");
  const [apellido, setApellido] = useState(user.apellido || "");
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || "");
  const [selectedClub, setSelectedClub] = useState<ClubOption>(POPULAR_CLUBS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!name.trim() || !apellido.trim()) {
      setError("Por favor completa tu nombre y apellido");
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 8) {
      setError("Por favor ingresa un número de WhatsApp válido");
      return;
    }

    const res = SaasStore.completeOnboarding(user.id, newPassword, {
      name: name.trim(),
      apellido: apellido.trim(),
      whatsapp: whatsapp.trim(),
      favoriteClub: selectedClub,
    });

    if (res.success && res.user) {
      onCompleted(res.user);
    } else {
      setError("Error al guardar los datos del perfil");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#11171F] border border-[#1FE07A]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(31,224,122,0.15)] space-y-6 my-8">
        {/* Banner de Bienvenida Obligatoria */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1FE07A]/15 border border-[#1FE07A]/30 text-xs font-bold text-[#1FE07A]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Primer Ingreso Requerido</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F8FAFC]">
            ¡Bienvenido a <span className="text-[#1FE07A]">FutboLive</span>!
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
            Por seguridad de tu cuenta en <strong>{user.tenantName || "tu negocio"}</strong>, debes cambiar la contraseña inicial y completar tus datos personales.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: CAMBIO DE CONTRASEÑA */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#172029]/60 border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#1FE07A]" />
              <span>1. Configurar tu Nueva Contraseña</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8]">Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#11171F] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8]">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full bg-[#11171F] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS PERSONALES */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#172029]/60 border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
              <UserIcon className="w-3.5 h-3.5 text-[#1FE07A]" />
              <span>2. Datos del Perfil & Contacto</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8]">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-[#11171F] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8]">Apellido</label>
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  className="w-full bg-[#11171F] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#94A3B8]">WhatsApp (para alertas de partidos)</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full bg-[#11171F] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 pl-10 pr-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: CUADRO / CLUB DEL QUE ES HINCHA */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#172029]/60 border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#1FE07A]" />
                <span>3. ¿De qué cuadro sos hincha?</span>
              </div>
              <span className="text-[10px] text-[#1FE07A] font-semibold">
                Personalizará tu pantalla de inicio
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {POPULAR_CLUBS.map((club) => {
                const isSelected = selectedClub.id === club.id;
                return (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => setSelectedClub(club)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-[#1FE07A]/15 border-[#1FE07A] shadow-[0_0_12px_rgba(31,224,122,0.25)] ring-1 ring-[#1FE07A]"
                        : "bg-[#11171F] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <Image
                        src={club.logo}
                        alt={club.name}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <span className={`text-[11px] font-bold leading-tight truncate w-full ${
                      isSelected ? "text-[#1FE07A]" : "text-[#CBD5E1]"
                    }`}>
                      {club.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTÓN DE CONFIRMACIÓN */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-extrabold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(31,224,122,0.4)]"
          >
            Guardar y Entrar a FutboLive
          </button>
        </form>
      </div>
    </div>
  );
}
