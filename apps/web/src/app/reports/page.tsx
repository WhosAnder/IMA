"use client";

import { ReportsListPage } from "@/views/ReportsListPage";
import { RequireRole } from "@/auth/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "supervisor"]}>
            <ReportsListPage />
        </RequireRole>
    );
}
