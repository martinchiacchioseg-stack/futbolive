"use client";

import { Tenant, AuthUser, ClubOption } from "@/types/saas";
import { POPULAR_CLUBS } from "@/lib/constants";

const DEFAULT_SUPERADMIN: AuthUser = {
  id: "sa-1",
  email: "superadmin@futbolive.com",
  name: "SuperAdmin",
  apellido: "Rolφ",
  role: "superadmin",
  mustChangePassword: false,
  profileCompleted: true,
  createdAt: "2026-10-01T00:00:00Z",
};

const DEFAULT_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    name: "Sports Bar & Grill Palermo",
    slug: "sports-bar-palermo",
    status: "active",
    allowedTournaments: ["liga_profesional", "copa_libertadores", "copa_argentina"],
    daysRemaining: 48,
    maxUsers: 5,
    contactEmail: "contacto@sportsbarpalermo.com",
    createdAt: "2026-09-15T12:00:00Z",
  },
  {
    id: "tenant-2",
    name: "Club Atlético Chascomús - Pantallas",
    slug: "club-chascomus",
    status: "active",
    allowedTournaments: ["liga_profesional", "copa_sudamericana"],
    daysRemaining: 180,
    maxUsers: 10,
    contactEmail: "gerencia@clubchascomus.ar",
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "tenant-3",
    name: "Pizzería Los Campeones",
    slug: "los-campeones",
    status: "trial",
    allowedTournaments: ["liga_profesional", "copa_libertadores", "champions_league"],
    daysRemaining: 5,
    maxUsers: 2,
    contactEmail: "pedidos@loscampeones.com",
    createdAt: "2026-10-15T15:00:00Z",
  },
];

const DEFAULT_USERS: { user: AuthUser; passwordHash: string }[] = [
  {
    user: DEFAULT_SUPERADMIN,
    passwordHash: "admin2026",
  },
  {
    user: {
      id: "usr-demo",
      tenantId: "tenant-1",
      tenantName: "Sports Bar & Grill Palermo",
      email: "cliente@sportsbar.com",
      role: "tenant_admin",
      mustChangePassword: true, // Debe cambiar automáticamente la contraseña
      profileCompleted: false,  // Debe completar perfil, WhatsApp y club
      createdAt: "2026-10-19T20:00:00Z",
    },
    passwordHash: "clave123",
  },
  {
    user: {
      id: "usr-active",
      tenantId: "tenant-1",
      tenantName: "Sports Bar & Grill Palermo",
      email: "boca.fan@sportsbar.com",
      name: "Martín",
      apellido: "Chiacchio",
      whatsapp: "+54 9 2241 556677",
      favoriteClub: POPULAR_CLUBS[0], // Boca Juniors
      role: "user",
      mustChangePassword: false,
      profileCompleted: true,
      createdAt: "2026-10-10T11:00:00Z",
    },
    passwordHash: "boca2026",
  },
];

const STORAGE_KEYS = {
  TENANTS: "futbolive_tenants_v1",
  USERS: "futbolive_users_v1",
  SESSION: "futbolive_session_v1",
};

export class SaasStore {
  public static getTenants(): Tenant[] {
    if (typeof window === "undefined") return DEFAULT_TENANTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TENANTS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(DEFAULT_TENANTS));
    } catch {
      // fallback
    }
    return DEFAULT_TENANTS;
  }

  public static getUsers(): { user: AuthUser; passwordHash: string }[] {
    if (typeof window === "undefined") return DEFAULT_USERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    } catch {
      // fallback
    }
    return DEFAULT_USERS;
  }

  public static getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  }

  public static setCurrentUser(user: AuthUser | null) {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }

  public static login(email: string, pass: string): { success: boolean; user?: AuthUser; error?: string } {
    const users = this.getUsers();
    const found = users.find(
      (u) => u.user.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === pass
    );

    if (!found) {
      return { success: false, error: "Usuario o contraseña incorrectos" };
    }

    this.setCurrentUser(found.user);
    return { success: true, user: found.user };
  }

  public static logout() {
    this.setCurrentUser(null);
  }

  // SuperAdmin crea un nuevo negocio SaaS
  public static createTenant(
    name: string,
    allowedTournaments: string[],
    daysRemaining = 30,
    contactEmail = ""
  ): Tenant {
    const tenants = this.getTenants();
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      status: "active",
      allowedTournaments,
      daysRemaining,
      maxUsers: 5,
      contactEmail,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTenant, ...tenants];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(updated));
    }
    return newTenant;
  }

  // SuperAdmin actualiza qué torneos ve un negocio
  public static updateTenantTournaments(tenantId: string, allowedTournaments: string[]): boolean {
    const tenants = this.getTenants();
    const idx = tenants.findIndex((t) => t.id === tenantId);
    if (idx === -1) return false;

    tenants[idx].allowedTournaments = allowedTournaments;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    }
    return true;
  }

  // SuperAdmin otorga cuenta con usuario y contraseña
  public static createUser(
    tenantId: string,
    email: string,
    tempPassword: string,
    role: "tenant_admin" | "user" = "user"
  ): AuthUser {
    const tenants = this.getTenants();
    const tenant = tenants.find((t) => t.id === tenantId);
    const users = this.getUsers();

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      tenantId,
      tenantName: tenant ? tenant.name : "Negocio General",
      email: email.trim(),
      role,
      mustChangePassword: true,  // Obligatorio cambiar clave
      profileCompleted: false,   // Obligatorio completar perfil
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, { user: newUser, passwordHash: tempPassword }];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    }
    return newUser;
  }

  // Primer ingreso: El usuario cambia su contraseña y completa perfil
  public static completeOnboarding(
    userId: string,
    newPassword: string,
    data: {
      name: string;
      apellido: string;
      whatsapp: string;
      favoriteClub: ClubOption;
    }
  ): { success: boolean; user?: AuthUser } {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.user.id === userId);
    if (idx === -1) return { success: false };

    const updatedUser: AuthUser = {
      ...users[idx].user,
      name: data.name,
      apellido: data.apellido,
      whatsapp: data.whatsapp,
      favoriteClub: data.favoriteClub,
      mustChangePassword: false,
      profileCompleted: true,
    };

    users[idx] = {
      user: updatedUser,
      passwordHash: newPassword,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  }
}
