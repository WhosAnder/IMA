import React, { useState, useEffect } from 'react';
import { X, Upload, File, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setFile(null);
            setProgress(0);
            setIsUploading(false);
            setIsCompleted(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);

        // Simulate upload progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setIsCompleted(true);
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        }, 200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Subir archivo</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {!file ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra y suelta
                                </div>
                                <p className="text-xs text-gray-400">PDF, DOC, Images (max. 10MB)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                                    <File className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-gray-400 hover:text-red-500 ml-2"
                                    disabled={isUploading || isCompleted}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {(isUploading || isCompleted) && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{isCompleted ? 'Completado' : 'Subiendo...'}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-200 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="flex items-center justify-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Archivo subido correctamente
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose} disabled={isUploading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading || isCompleted}
                        isLoading={isUploading}
                    >
                        {isCompleted ? 'Cerrar' : 'Subir'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
