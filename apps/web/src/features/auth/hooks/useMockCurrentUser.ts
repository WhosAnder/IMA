import { useEffect, useState } from "react";
import type { CurrentUser, UserRole } from "../types/roles";

const DEFAULT_ROLE: UserRole = "admin";

export function useMockCurrentUser(): CurrentUser {
    const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get("role") as UserRole | null;

        if (roleParam && ["admin", "supervisor", "warehouse-manager"].includes(roleParam)) {
            setRole(roleParam);
        }
    }, []);

    return {
        id: "mock-user-1",
        name: "Usuario Demo",
        role,
        area: role === "supervisor" ? "Vía de la guía" : undefined,
    };
}

