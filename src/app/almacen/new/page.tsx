"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NewWarehouseReportPage } from '@/views/NewWarehouseReportPage';

export default function Page() {
    return (
        <AppLayout title="Nuevo Reporte de Almacén">
            <NewWarehouseReportPage />
        </AppLayout>
    );
}
