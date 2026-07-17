import type { AdminRole } from "@/lib/admin/auth";

/**
 * Ajoute le rôle métier à la session Auth.js.
 * « admin » (direction) et « reception » ont le même accès à ce stade ;
 * le rôle identifie qui est connecté et prépare les droits de la Phase 3.
 */
declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: AdminRole;
    };
  }

  interface User {
    role?: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}

export {};
