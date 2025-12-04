import { useEffect, useState } from "react";
import type { CurrentUser, UserRole } from "./roles";
import { useAuth } from "./AuthContext";

const DEFAULT_ROLE: UserRole = "admin";

export function useMockCurrentUser(): CurrentUser {
    const { user } = useAuth();
    const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get("role") as UserRole | null;

        if (roleParam && ["admin", "supervisor", "almacenista"].includes(roleParam)) {
            setRole(roleParam);
        }
    }, []);

    if (user) {
        return {
            id: user.id,
            name: user.email.split("@")[0], // Simple name derivation
            role: user.role as UserRole,
            area: user.role === "supervisor" ? "Vía de la guía" : undefined,
        };
    }

    return {
        id: "mock-user-1",
        name: "Usuario Demo",
        role,
        area: role === "supervisor" ? "Vía de la guía" : undefined,
    };
}
