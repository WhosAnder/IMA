export type UserRole = "admin" | "supervisor" | "almacenista";

export type CurrentUser = {
    id: string;
    name: string;
    role: UserRole;
    area?: string; // e.g. "vía de la guía", can be used later for filtering
};

export const ROLE_LABELS: Record<UserRole, string> = {
    admin: "IMA Claude Admin",
    supervisor: "IMA Claude Supervisor",
    almacenista: "IMA Colad Almacén",
};
