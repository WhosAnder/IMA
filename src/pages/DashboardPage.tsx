import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { UploadModal } from '../components/files/UploadModal';
import {
    Folder,
    FileText,
    FileImage,
    File,
    Download,
    Edit2,
    Trash2,
    Plus,
    FolderPlus
} from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'pdf' | 'doc' | 'image' | 'other';
    owner: string;
    size: string;
    date: string;
}

const mockFiles: FileItem[] = [
    { id: '1', name: 'Documentos Legales', type: 'folder', owner: 'Yo', size: '-', date: '19 Nov 2024' },
    { id: '2', name: 'Propuestas 2025', type: 'folder', owner: 'Yo', size: '-', date: '18 Nov 2024' },
    { id: '3', name: 'Contrato_Servicios_v2.pdf', type: 'pdf', owner: 'Yo', size: '2.4 MB', date: '15 Nov 2024' },
    { id: '4', name: 'Reporte_Financiero_Q3.xlsx', type: 'other', owner: 'Ana García', size: '1.8 MB', date: '12 Nov 2024' },
    { id: '5', name: 'Logo_IMA_Vector.svg', type: 'image', owner: 'Yo', size: '450 KB', date: '10 Nov 2024' },
    { id: '6', name: 'Minuta_Reunion_Cliente.docx', type: 'doc', owner: 'Carlos Ruiz', size: '850 KB', date: '08 Nov 2024' },
];

const FileIcon = ({ type }: { type: FileItem['type'] }) => {
    switch (type) {
        case 'folder': return <Folder className="w-5 h-5 text-blue-500 fill-blue-100" />;
        case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
        case 'doc': return <FileText className="w-5 h-5 text-blue-600" />;
        case 'image': return <FileImage className="w-5 h-5 text-purple-500" />;
        default: return <File className="w-5 h-5 text-gray-400" />;
    }
};

export const DashboardPage: React.FC = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <AppLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Mis archivos</h2>
                    <p className="text-sm text-gray-500">Gestiona tus documentos y carpetas</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => { }}>
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Nueva carpeta
                    </Button>
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Subir archivo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
                                <th className="px-6 py-3 font-medium">Nombre</th>
                                <th className="px-6 py-3 font-medium">Propietario</th>
                                <th className="px-6 py-3 font-medium">Tamaño</th>
                                <th className="px-6 py-3 font-medium">Modificado</th>
                                <th className="px-6 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockFiles.map((file) => (
                                <tr
                                    key={file.id}
                                    className="hover:bg-blue-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="mr-3">
                                                <FileIcon type={file.type} />
                                            </div>
                                            <span className="font-medium text-gray-900">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {file.owner}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {file.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {file.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Descargar">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="Renombrar">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md" title="Eliminar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </AppLayout>
    );
};
