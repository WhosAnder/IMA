"use client";

import { WarehouseReportDetailPage } from "@/views/WarehouseReportDetailPage";
import { RequireRole } from "@/auth/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "almacenista"]}>
            <WarehouseReportDetailPage />
        </RequireRole>
    );
}
