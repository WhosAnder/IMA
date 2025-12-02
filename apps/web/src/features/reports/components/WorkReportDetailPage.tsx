"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/shared/lib/api';
import { AppLayout } from '@/shared/layout/AppLayout';
import { WorkReportPreview } from './WorkReportPreview';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function WorkReportDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const { data: reportDetails, isLoading, error } = useQuery({
        queryKey: ["workReport", id],
        queryFn: () => apiGet(`/reports/${id}`),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <AppLayout title="Cargando...">
                <div className="flex items-center justify-center h-[60vh]">
                    <p className="text-gray-500">Cargando reporte...</p>
                </div>
            </AppLayout>
        );
    }

    if (error || !reportDetails) {
        return (
            <AppLayout title="Reporte no encontrado">
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">Reporte no encontrado</h1>
                    <p className="text-gray-500">El reporte que buscas no existe o no está disponible.</p>
                    <Link href="/reports">
                        <Button variant="secondary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a la lista
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title={`Reporte ${reportDetails.subsistema}`}>
            <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/reports">
                            <Button variant="ghost">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Detalle de Reporte</h1>
                            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                <span>{reportDetails.subsistema}</span>
                                <span>•</span>
                                <span>{reportDetails.nombreResponsable}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-xl border border-gray-200 shadow-inner overflow-auto">
                    <div className="mx-auto" style={{ width: '816px' }}> {/* Letter width */}
                        <WorkReportPreview values={reportDetails} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

