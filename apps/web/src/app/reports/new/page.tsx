"use client";

import { AppLayout } from "../../../components/layout/AppLayout";
import { NewWorkReportPage } from "../../../views/NewWorkReportPage";

export default function NewReportPage() {
  return (
    <AppLayout title="Nuevo reporte">
      <NewWorkReportPage />
    </AppLayout>
  );
}
