"use client";

import { WarehouseReportsListPage } from "@/views/WarehouseReportsListPage";
import { RequireRole } from "@/auth/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "almacenista"]}>
            <WarehouseReportsListPage />
        </RequireRole>
    );
}
