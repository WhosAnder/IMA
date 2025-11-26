"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Plus, Eye } from "lucide-react";
import type { WorkReportListItem } from "@/types/workReportList";

export function ReportsListPage() {
    const { data: reports, isLoading } = useQuery<WorkReportListItem[]>({
        queryKey: ["workReports"],
        queryFn: () => apiGet("/reports")
    });

    return (
        <AppLayout title="Reportes de Trabajo">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Reportes de trabajo</h1>
                        <p className="text-sm text-gray-500">
                            Lista de reportes generados desde la API.
                        </p>
                    </div>
                    <Link href="/reports/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo reporte
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Cargando reportes...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subsistema</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports?.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.folio}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.subsistema}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.fecha}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.responsable}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.turno === 'Matutino' ? 'bg-yellow-100 text-yellow-800' :
                                                    report.turno === 'Vespertino' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                {report.turno}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/reports/${report.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                                                <Eye className="w-4 h-4 mr-1" /> Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

