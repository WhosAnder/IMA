import { useMockCurrentUser } from "@/features/auth/hooks/useMockCurrentUser";
import { AdminDashboard } from "./AdminDashboard";
import { SupervisorDashboard } from "./SupervisorDashboard";
import { WarehouseDashboard } from "./WarehouseDashboard";
import { AppLayout } from "@/shared/layout/AppLayout";

export function DashboardPage() {
    const user = useMockCurrentUser();

    let content: React.ReactNode = null;

    if (user.role === "admin") {
        content = <AdminDashboard />;
    } else if (user.role === "supervisor") {
        content = <SupervisorDashboard />;
    } else if (user.role === "warehouse-manager") {
        content = <WarehouseDashboard />;
    }

    return <AppLayout title="Dashboard">{content}</AppLayout>;
}

