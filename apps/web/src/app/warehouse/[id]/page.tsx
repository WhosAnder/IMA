"use client";

import { WarehouseReportDetailPage } from "@/features/warehouse/views/WarehouseReportDetailPage";
import { RequireRole } from "@/features/auth/components/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "warehouse-manager"]}>
            <WarehouseReportDetailPage />
        </RequireRole>
    );
}
