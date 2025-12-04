import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplateForReport } from '../hooks/useTemplates';
import { useCreateWarehouseReportMutation } from '../hooks/useWarehouseReports';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { SignaturePad } from '@/components/ui/SignaturePad';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { WarehouseReportPreview } from '@/components/almacen/WarehouseReportPreview';
import { warehouseReportSchema, WarehouseReportFormValues } from '@/schema/warehouseReportSchema';
import { themes } from '@/theme/colors';
import { Save, Plus, Trash2 } from 'lucide-react';

// Mock Subsystems (reused from Work Report logic or defined anew)
const mockSubsystems = [
    { value: 'EQUIPO DE GUIA/ TRABAJO DE GUIA', label: 'Equipo de guia/ trabajo de guia' },
    { value: 'VEHICULO', label: 'Vehiculo' },
    { value: 'EQUIPO DE PROPULSION', label: 'Equipo de propulsion' },
    { value: 'EQUIPO DE CONTROL DE TREN (ATC)', label: 'Equipo de control de tren (ATC)' },
    { value: 'EQUIPO DE COMUNICACION', label: 'Equipo de comunicacion' },
    { value: 'EQUIPO DE DISTRIBUCION DE POTENCIA DE BAJO VOLTAJE', label: 'Equipo de distribucion de potencia de bajo voltaje' },
    { value: 'EQUIPO DE CONTROL CENTRAL Y SCADA', label: 'Equipo de control central y SCADA' },
    { value: 'EQUIPO DE ESTACION', label: 'Equipo de estacion' },
    { value: 'EQUIPO DE MANTENIMIENTO', label: 'Equipo de mantenimiento' },
];

export const NewWarehouseReportPage: React.FC = () => {
    const primaryColor = themes.warehouse.primary;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<WarehouseReportFormValues>({
        resolver: zodResolver(warehouseReportSchema) as any,
        defaultValues: {
            subsistema: '',
            fechaHoraEntrega: new Date().toISOString().slice(0, 16),
            fechaHoraRecepcion: new Date().toISOString().slice(0, 16),
            turno: '',
            tipoMantenimiento: '',
            frecuencia: 'Eventual', // Default for warehouse? Or empty.
            nombreQuienRecibe: '',
            nombreAlmacenista: '',
            nombreQuienEntrega: '',
            nombreAlmacenistaCierre: '',
            herramientas: [],
            refacciones: [],
            observacionesGenerales: '',
        }
    });

    const { fields: toolsFields, append: appendTool, remove: removeTool } = useFieldArray({
        control,
        name: "herramientas"
    });

    const { fields: partsFields, append: appendPart, remove: removePart } = useFieldArray({
        control,
        name: "refacciones"
    });

    const fechaHoraEntrega = watch('fechaHoraEntrega');
    const watchedValues = useWatch({ control });

    // Auto-calculate shift
    useEffect(() => {
        if (fechaHoraEntrega) {
            const date = new Date(fechaHoraEntrega);
            const hour = date.getHours();
            let shift = 'Nocturno';

            if (hour >= 6 && hour < 14) {
                shift = 'Matutino';
            } else if (hour >= 14 && hour < 22) {
                shift = 'Vespertino';
            }

            setValue('turno', shift);
        }
    }, [fechaHoraEntrega, setValue]);

    // Auto-set start time on mount
    useEffect(() => {
        const currentStart = watch('fechaHoraEntrega');
        if (!currentStart) {
            setValue('fechaHoraEntrega', new Date().toISOString().slice(0, 16));
        }
    }, []);

    // Template Selection
    const subsistema = watch('subsistema');
    const tipoMantenimiento = watch('tipoMantenimiento');
    const frecuencia = watch('frecuencia');

    const { data: template } = useTemplateForReport({
        tipoReporte: 'warehouse',
        subsistema,
        tipoMantenimiento,
        frecuencia
    });

    // Mutation
    const createReportMutation = useCreateWarehouseReportMutation();
    const router = useRouter();

    const onSubmit = async (data: WarehouseReportFormValues) => {
        // Auto-set end time (fechaHoraRecepcion)
        const now = new Date().toISOString().slice(0, 16);
        data.fechaHoraRecepcion = now;
        
        // Helper to process items with images
        const processItems = async (items: any[]) => {
            return Promise.all(items.map(async (item) => {
                const evidences = await Promise.all((item.evidences || []).map(async (file: any) => {
                    if (file instanceof File) {
                        return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(file);
                        });
                    }
                    return file;
                }));
                return { ...item, evidences };
            }));
        };

        const herramientas = await processItems(data.herramientas);
        const refacciones = await processItems(data.refacciones);
        
        // Include templateId if available
        const payload = {
            ...data,
            herramientas,
            refacciones,
            templateId: template?._id
        };

        console.log('Warehouse Report Data:', payload);
        
        try {
            const result = await createReportMutation.mutateAsync(payload);
            alert('Reporte de almacén generado');
            router.push(`/almacen/${(result as any)._id}`);
        } catch (error) {
            console.error("Error creating warehouse report:", error);
            alert('Error al generar el reporte');
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Formato de Almacén</h1>
                <p className="text-gray-500">Registro de entrega de herramientas y refacciones.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">

                {/* Left Column: Form */}
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* 1. General Data */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryColor }}>1</div>
                                <h2 className="text-lg font-semibold text-gray-800">Datos generales</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subsistema</label>
                                    <select
                                        {...register('subsistema')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.subsistema ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {mockSubsystems.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.subsistema && <p className="mt-1 text-sm text-red-600">{errors.subsistema.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de entrega</label>
                                    <input
                                        type="datetime-local"
                                        {...register('fechaHoraEntrega')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.fechaHoraEntrega ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.fechaHoraEntrega && <p className="mt-1 text-sm text-red-600">{errors.fechaHoraEntrega.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                                    <input
                                        type="text"
                                        {...register('turno')}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mantenimiento</label>
                                    <select
                                        {...register('tipoMantenimiento')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.tipoMantenimiento ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Entrega de material">Entrega de material</option>
                                        <option value="Devolución de material">Devolución de material</option>
                                        <option value="Préstamo de herramienta">Préstamo de herramienta</option>
                                    </select>
                                    {errors.tipoMantenimiento && <p className="mt-1 text-sm text-red-600">{errors.tipoMantenimiento.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                                    <select
                                        {...register('frecuencia')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.frecuencia ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Eventual">Eventual</option>
                                        <option value="Diaria">Diaria</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Mensual">Mensual</option>
                                    </select>
                                    {errors.frecuencia && <p className="mt-1 text-sm text-red-600">{errors.frecuencia.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Almacenista</label>
                                    <input
                                        type="text"
                                        {...register('nombreAlmacenista')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.nombreAlmacenista ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.nombreAlmacenista && <p className="mt-1 text-sm text-red-600">{errors.nombreAlmacenista.message}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre quien recibe</label>
                                    <input
                                        type="text"
                                        {...register('nombreQuienRecibe')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.nombreQuienRecibe ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.nombreQuienRecibe && <p className="mt-1 text-sm text-red-600">{errors.nombreQuienRecibe.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* 2. Herramientas */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryColor }}>2</div>
                                    <h2 className="text-lg font-semibold text-gray-800">Herramientas</h2>
                                </div>
                                <Button type="button" variant="secondary" onClick={() => appendTool({ id: crypto.randomUUID(), name: '', units: 1, observations: '', evidences: [] })}>
                                    <Plus className="w-4 h-4 mr-2" /> Agregar
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {toolsFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                        <button
                                            type="button"
                                            onClick={() => removeTool(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-6">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Herramienta</label>
                                                <input
                                                    {...register(`herramientas.${index}.name`)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Nombre de la herramienta"
                                                />
                                                {errors.herramientas?.[index]?.name && <p className="text-xs text-red-500 mt-1">{errors.herramientas[index]?.name?.message}</p>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Unidades</label>
                                                <input
                                                    type="number"
                                                    {...register(`herramientas.${index}.units`, { valueAsNumber: true })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                                {errors.herramientas?.[index]?.units && <p className="text-xs text-red-500 mt-1">{errors.herramientas[index]?.units?.message}</p>}
                                            </div>
                                            <div className="md:col-span-4">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Observaciones</label>
                                                <input
                                                    {...register(`herramientas.${index}.observations`)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Opcional"
                                                />
                                            </div>
                                            <div className="md:col-span-12">
                                                <Controller
                                                    name={`herramientas.${index}.evidences`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUpload
                                                            label="Evidencias (máx 5)"
                                                            onChange={field.onChange}
                                                            maxFiles={5}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {toolsFields.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">No hay herramientas agregadas.</p>
                                )}
                            </div>
                        </section>

                        {/* 3. Refacciones */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryColor }}>3</div>
                                    <h2 className="text-lg font-semibold text-gray-800">Refacciones</h2>
                                </div>
                                <Button type="button" variant="secondary" onClick={() => appendPart({ id: crypto.randomUUID(), name: '', units: 1, observations: '', evidences: [] })}>
                                    <Plus className="w-4 h-4 mr-2" /> Agregar
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {partsFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                        <button
                                            type="button"
                                            onClick={() => removePart(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-6">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Refacción</label>
                                                <input
                                                    {...register(`refacciones.${index}.name`)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Nombre de la refacción"
                                                />
                                                {errors.refacciones?.[index]?.name && <p className="text-xs text-red-500 mt-1">{errors.refacciones[index]?.name?.message}</p>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Unidades</label>
                                                <input
                                                    type="number"
                                                    {...register(`refacciones.${index}.units`, { valueAsNumber: true })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                                {errors.refacciones?.[index]?.units && <p className="text-xs text-red-500 mt-1">{errors.refacciones[index]?.units?.message}</p>}
                                            </div>
                                            <div className="md:col-span-4">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Observaciones</label>
                                                <input
                                                    {...register(`refacciones.${index}.observations`)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Opcional"
                                                />
                                            </div>
                                            <div className="md:col-span-12">
                                                <Controller
                                                    name={`refacciones.${index}.evidences`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUpload
                                                            label="Evidencias (máx 5)"
                                                            onChange={field.onChange}
                                                            maxFiles={5}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {partsFields.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">No hay refacciones agregadas.</p>
                                )}
                            </div>
                        </section>

                        {/* 4. Cierre */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryColor }}>4</div>
                                <h2 className="text-lg font-semibold text-gray-800">Cierre</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones generales</label>
                                    <textarea
                                        {...register('observacionesGenerales')}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                                        placeholder="Comentarios finales..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de recepción</label>
                                        <input
                                            type="datetime-local"
                                            {...register('fechaHoraRecepcion')}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.fechaHoraRecepcion ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.fechaHoraRecepcion && <p className="mt-1 text-sm text-red-600">{errors.fechaHoraRecepcion.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre quien entrega</label>
                                        <input
                                            type="text"
                                            {...register('nombreQuienEntrega')}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.nombreQuienEntrega ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.nombreQuienEntrega && <p className="mt-1 text-sm text-red-600">{errors.nombreQuienEntrega.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Almacenista (Cierre)</label>
                                        <input
                                            type="text"
                                            {...register('nombreAlmacenistaCierre')}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.nombreAlmacenistaCierre ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.nombreAlmacenistaCierre && <p className="mt-1 text-sm text-red-600">{errors.nombreAlmacenistaCierre.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Controller
                                            name="firmaQuienEntrega"
                                            control={control}
                                            render={({ field }) => (
                                                <SignaturePad
                                                    label="Firma quien entrega"
                                                    onChange={field.onChange}
                                                    error={errors.firmaQuienEntrega?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="firmaAlmacenista"
                                            control={control}
                                            render={({ field }) => (
                                                <SignaturePad
                                                    label="Firma almacenista"
                                                    onChange={field.onChange}
                                                    error={errors.firmaAlmacenista?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="firmaQuienRecibe"
                                            control={control}
                                            render={({ field }) => (
                                                <SignaturePad
                                                    label="Firma quien recibe"
                                                    onChange={field.onChange}
                                                    error={errors.firmaQuienRecibe?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 text-lg"
                                isLoading={isSubmitting}
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Generar reporte de almacén
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Preview */}
                <div>
                    <WarehouseReportPreview values={watchedValues} />
                </div>
            </div>
        </div>
    );
};
