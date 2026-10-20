export type UserRole = "superadmin" | "tenant_admin" | "user";

export type TenantStatus = "active" | "trial" | "suspended" | "expired";

export interface TournamentOption {
  id: string;
  name: string;
  category: "local" | "continental" | "internacional";
  country?: string;
  logo: string;
  activeMatchesCount: number;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  allowedTournaments: string[]; // IDs de torneos habilitados
  daysRemaining: number;
  maxUsers: number;
  contactEmail: string;
  createdAt: string;
}

export interface ClubOption {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  leagueName: string;
}

export interface AuthUser {
  id: string;
  tenantId?: string;
  tenantName?: string;
  email: string;
  name?: string;
  apellido?: string;
  whatsapp?: string;
  favoriteClub?: ClubOption;
  role: UserRole;
  mustChangePassword: boolean;
  profileCompleted: boolean;
  createdAt: string;
}
