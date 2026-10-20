"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Users,
  Trophy,
  Plus,
  Key,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sliders,
  X,
  Sparkles,
} from "lucide-react";
import { SaasStore } from "@/lib/saas-store";
import { Tenant, AuthUser } from "@/types/saas";
import { AVAILABLE_TOURNAMENTS } from "@/lib/constants";
import { SuperAdminWidget } from "@/components/admin/SuperAdminWidget";

interface SuperAdminDashboardProps {
  onClose: () => void;
  onRefreshData?: () => void;
}

export function SuperAdminDashboard({ onClose, onRefreshData }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"tenants" | "users" | "tournaments" | "metrics">("tenants");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [usersList, setUsersList] = useState<{ user: AuthUser; passwordHash: string }[]>([]);

  // Modales internos
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // Formulario nuevo negocio
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantDays, setTenantDays] = useState(30);
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([
    "liga_profesional",
    "copa_libertadores",
  ]);

  // Formulario nuevo usuario
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userTempPass, setUserTempPass] = useState("");
  const [userRole, setUserRole] = useState<"tenant_admin" | "user">("user");

  // Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const loadedTenants = SaasStore.getTenants();
    const loadedUsers = SaasStore.getUsers();
    setTenants(loadedTenants);
    setUsersList(loadedUsers);
    if (loadedTenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(loadedTenants[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) return;

    SaasStore.createTenant(tenantName.trim(), selectedTournaments, tenantDays, tenantEmail.trim());
    setTenantName("");
    setTenantEmail("");
    setShowNewTenantModal(false);
    loadData();
    showToast("¡Nuevo negocio SaaS creado exitosamente!");
    if (onRefreshData) onRefreshData();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim() || !userTempPass.trim() || !selectedTenantId) return;

    SaasStore.createUser(selectedTenantId, userEmail, userTempPass, userRole);
    setUserEmail("");
    setUserTempPass("");
    setShowNewUserModal(false);
    loadData();
    showToast("¡Cuenta creada! El usuario deberá cambiar su clave al entrar.");
    if (onRefreshData) onRefreshData();
  };

  const toggleTenantTournament = (tenantId: string, tournamentId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    const currentAllowed = tenant.allowedTournaments || [];
    const newAllowed = currentAllowed.includes(tournamentId)
      ? currentAllowed.filter((id) => id !== tournamentId)
      : [...currentAllowed, tournamentId];

    SaasStore.updateTenantTournaments(tenantId, newAllowed);
    loadData();
    showToast("Torneos actualizados para el negocio seleccionado.");
    if (onRefreshData) onRefreshData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#11171F] border border-[rgba(255,255,255,0.1)] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 my-6">
        {/* Toast Notificación */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#1FE07A] text-[#0A0E13] font-bold text-xs shadow-lg shadow-[#1FE07A]/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Cabecera del Panel */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1FE07A]/15 border border-[#1FE07A]/30 flex items-center justify-center text-[#1FE07A]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#1FE07A] uppercase tracking-wider">
                  Consola Central
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="text-xs text-[#94A3B8]">Multi-negocio SaaS</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-[#F8FAFC]">
                Panel de Superadministrador
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#172029] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[rgba(255,255,255,0.06)]">
          {[
            { id: "tenants", label: "Negocios / Clientes SaaS", icon: Building2 },
            { id: "users", label: "Otorgar Cuentas y Accesos", icon: Users },
            { id: "tournaments", label: "Copas y Torneos por Negocio", icon: Trophy },
            { id: "metrics", label: "Infraestructura & API", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1FE07A] text-[#0A0E13] shadow-[0_0_12px_rgba(31,224,122,0.3)]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#172029]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* PESTAÑA 1: NEGOCIOS / CLIENTES SAAS */}
        {activeTab === "tenants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">
                Negocios registrados en la plataforma ({tenants.length})
              </span>
              <button
                onClick={() => setShowNewTenantModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-bold text-xs hover:brightness-110 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nuevo Negocio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#172029] border border-[rgba(255,255,255,0.06)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#F8FAFC] truncate">{t.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        t.status === "active"
                          ? "bg-[#1FE07A]/15 text-[#1FE07A] border border-[#1FE07A]/30"
                          : "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#94A3B8] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Vigencia restante:</span>
                      <span className="font-mono text-[#F8FAFC] font-bold">{t.daysRemaining} días</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Torneos habilitados:</span>
                      <span className="font-mono text-[#1FE07A] font-bold">
                        {t.allowedTournaments?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] truncate">{t.contactEmail || "Sin email"}</span>
                    <button
                      onClick={() => setActiveTab("tournaments")}
                      className="text-[#1FE07A] hover:underline font-semibold"
                    >
                      Editar Torneos →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 2: OTORGAR CUENTAS Y ACCESOS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">
                Cuentas activas y otorgadas ({usersList.length})
              </span>
              <button
                onClick={() => setShowNewUserModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-bold text-xs hover:brightness-110 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>Otorgar Nueva Cuenta</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#172029]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#64748B] bg-[#0A0E13]/30">
                    <th className="py-2.5 px-3 font-semibold">Usuario / Email</th>
                    <th className="py-2.5 px-3 font-semibold">Negocio SaaS</th>
                    <th className="py-2.5 px-3 font-semibold">Rol</th>
                    <th className="py-2.5 px-3 font-semibold">Estado de Ingreso</th>
                    <th className="py-2.5 px-3 font-semibold">Club Hincha</th>
                    <th className="py-2.5 px-3 font-semibold">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {usersList.map((item) => {
                    const u = item.user;
                    return (
                      <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)]">
                        <td className="py-2.5 px-3 font-medium text-[#F8FAFC]">
                          <div>{u.email}</div>
                          {u.name && (
                            <span className="text-[10px] text-[#94A3B8]">
                              {u.name} {u.apellido}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[#CBD5E1]">
                          {u.tenantName || "SuperAdmin Global"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === "superadmin"
                                ? "bg-[#1FE07A]/20 text-[#1FE07A]"
                                : "bg-[#1E2833] text-[#CBD5E1]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {u.mustChangePassword ? (
                            <span className="inline-flex items-center gap-1 text-[#F59E0B] font-bold text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>Debe cambiar clave</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#1FE07A] font-bold text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Perfil Completo</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[#CBD5E1]">
                          {u.favoriteClub ? u.favoriteClub.name : "Pendiente"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#94A3B8]">
                          {u.whatsapp || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: COPAS Y TORNEOS POR NEGOCIO */}
        {activeTab === "tournaments" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#172029]/60 border border-[rgba(255,255,255,0.06)] text-xs text-[#CBD5E1]">
              <span className="text-[#1FE07A] font-bold">Instrucción: </span>
              El Superadministrador puede seleccionar qué torneos y copas ve cada negocio. Quien ingrese a ese negocio solo verá la información de los torneos habilitados.
            </div>

            <div className="space-y-4">
              {tenants.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#172029] border border-[rgba(255,255,255,0.06)] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
                    <div>
                      <h4 className="font-bold text-sm text-[#F8FAFC]">{t.name}</h4>
                      <span className="text-[11px] text-[#94A3B8]">
                        Torneos visibles para los usuarios de este negocio
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#11171F] text-[#1FE07A] font-mono font-bold">
                      {t.allowedTournaments?.length || 0} activos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {AVAILABLE_TOURNAMENTS.map((tour) => {
                      const isAllowed = t.allowedTournaments?.includes(tour.id);
                      return (
                        <button
                          key={tour.id}
                          type="button"
                          onClick={() => toggleTenantTournament(t.id, tour.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                            isAllowed
                              ? "bg-[#1FE07A]/15 border-[#1FE07A]/50 text-[#F8FAFC]"
                              : "bg-[#11171F] border-[rgba(255,255,255,0.06)] text-[#64748B] opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className="relative w-6 h-6 flex-shrink-0">
                            <Image
                              src={tour.logo}
                              alt={tour.name}
                              fill
                              sizes="24px"
                              className="object-contain"
                            />
                          </div>
                          <div className="truncate">
                            <span className="block text-xs font-semibold truncate">
                              {tour.name}
                            </span>
                            <span className="block text-[10px] text-[#94A3B8]">
                              {isAllowed ? "Habilitado" : "Oculto"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: MÉTRICAS Y CONSUMO DE API */}
        {activeTab === "metrics" && (
          <div>
            <SuperAdminWidget requestsUsed={820} requestsLimit={1000} activeUsers={3410} cacheHitRatio={95.8} />
          </div>
        )}

        {/* MODAL CREAR NEGOCIO */}
        {showNewTenantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md bg-[#11171F] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  Nuevo Negocio SaaS
                </h3>
                <button onClick={() => setShowNewTenantModal(false)} className="text-[#94A3B8]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTenant} className="space-y-3">
                <div>
                  <label className="text-xs text-[#CBD5E1]">Nombre del Negocio / Cliente</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Ej. Sports Bar Recoleta"
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#CBD5E1]">Email de Contacto</label>
                  <input
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    placeholder="gerencia@negocio.com"
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#CBD5E1]">Días de Suscripción</label>
                  <input
                    type="number"
                    value={tenantDays}
                    onChange={(e) => setTenantDays(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-bold text-sm hover:brightness-110"
                  >
                    Crear y Activar Negocio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL OTORGAR CUENTA */}
        {showNewUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md bg-[#11171F] border border-[rgba(255,255,255,0.1)] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
                  Otorgar Cuenta con Usuario y Contraseña
                </h3>
                <button onClick={() => setShowNewUserModal(false)} className="text-[#94A3B8]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs text-[#F59E0B]">
                Al ingresar, el sistema le exigirá automáticamente cambiar la contraseña y completar perfil, WhatsApp y club.
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="text-xs text-[#CBD5E1]">Asignar a Negocio</label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#CBD5E1]">Email / Usuario</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="nuevo.usuario@negocio.com"
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#CBD5E1]">Contraseña Provisoria Inicial</label>
                  <input
                    type="text"
                    required
                    value={userTempPass}
                    onChange={(e) => setUserTempPass(e.target.value)}
                    placeholder="Ej. ClaveTemporal2026!"
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] font-mono focus:outline-none focus:border-[#1FE07A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#CBD5E1]">Rol de Usuario</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as typeof userRole)}
                    className="w-full bg-[#172029] border border-[rgba(255,255,255,0.08)] rounded-xl py-2 px-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#1FE07A]"
                  >
                    <option value="user">Usuario del negocio</option>
                    <option value="tenant_admin">Administrador del negocio</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1FE07A] text-[#0A0E13] font-bold text-sm hover:brightness-110"
                  >
                    Generar y Otorgar Credenciales
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
