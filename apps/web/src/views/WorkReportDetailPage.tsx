import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkReportPreview } from '@/components/reports/WorkReportPreview';
import { mockWorkReportDetails, mockWorkReports } from '@/mock/workReports';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function WorkReportDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const reportDetails = mockWorkReportDetails[id];
    const reportMeta = mockWorkReports.find(r => r.id === id);

    if (!reportDetails || !reportMeta) {
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
        <AppLayout title={`Reporte ${reportMeta.folio}`}>
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
                            <h1 className="text-xl font-bold text-gray-900">Detalle de Reporte: {reportMeta.folio}</h1>
                            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                <span>{reportMeta.subsistema}</span>
                                <span>•</span>
                                <span>{reportMeta.fecha}</span>
                                <span>•</span>
                                <span>{reportMeta.responsable}</span>
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
