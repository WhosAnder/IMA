"use client";

import { WarehouseReportsListPage } from "@/features/warehouse/views/WarehouseReportsListPage";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "warehouse-manager"]}>
            <WarehouseReportsListPage />
        </RequireRole>
    );
}
