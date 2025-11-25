"use client";

import { WorkReportDetailPage } from "@/views/WorkReportDetailPage";
import { RequireRole } from "@/auth/RequireRole";

export default function Page() {
    return (
        <RequireRole allowedRoles={["admin", "supervisor"]}>
            <WorkReportDetailPage />
        </RequireRole>
    );
}
