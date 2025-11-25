import type { UserRole } from "@/auth/roles";

type NavItem = {
    label: string;
    href: string;
};

type RoleNavConfig = {
    main: NavItem[];
};

export const navConfig: Record<UserRole, RoleNavConfig> = {
    admin: {
        main: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reportes de trabajo", href: "/reports" },
            { label: "Reportes de almacén", href: "/almacen" },
        ],
    },
    supervisor: {
        main: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reportes de trabajo", href: "/reports" },
        ],
    },
    almacenista: {
        main: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Reportes de almacén", href: "/almacen" },
        ],
    },
};
