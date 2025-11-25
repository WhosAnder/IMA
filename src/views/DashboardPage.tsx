import { useMockCurrentUser } from "@/auth/useMockCurrentUser";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { SupervisorDashboard } from "./dashboards/SupervisorDashboard";
import { WarehouseDashboard } from "./dashboards/WarehouseDashboard";
import { AppLayout } from "@/components/layout/AppLayout";

export function DashboardPage() {
    const user = useMockCurrentUser();

    let content: React.ReactNode = null;

    if (user.role === "admin") {
        content = <AdminDashboard />;
    } else if (user.role === "supervisor") {
        content = <SupervisorDashboard />;
    } else if (user.role === "almacenista") {
        content = <WarehouseDashboard />;
    }

    return <AppLayout title="Dashboard">{content}</AppLayout>;
}
