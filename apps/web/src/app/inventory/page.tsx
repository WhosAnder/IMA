"use client";

import { WarehouseReportsListPage } from "@/features/inventory/views/WarehouseReportsListPage";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "almacenista"]}>
            <WarehouseReportsListPage />
        </RequireRole>
    );
}
