"use client";

import { WarehouseReportDetailPage } from "@/features/inventory/views/WarehouseReportDetailPage";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "almacenista"]}>
            <WarehouseReportDetailPage />
        </RequireRole>
    );
}
