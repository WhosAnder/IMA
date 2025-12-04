import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplateForReport } from '../hooks/useTemplates';
import { useCreateWorkReportMutation } from '../hooks/useWorkReports';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { MultiSelect } from '../components/ui/MultiSelect';
import { SignaturePad } from '../components/ui/SignaturePad';
import { ImageUpload } from '../components/ui/ImageUpload';
import { WorkReportPreview } from '../components/reports/WorkReportPreview';
import { formatoTrabajoSchema } from '../config/formatoTrabajoSchema';
import { ChevronRight, Save } from 'lucide-react';

// Mock Data
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

const mockFrequencies = [
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'otra', label: 'Otra' },
];

const mockWorkers = [
  { value: 'ana_garcia', label: 'Ana García' },
  { value: 'carlos_ruiz', label: 'Carlos Ruiz' },
  { value: 'luis_perez', label: 'Luis Pérez' },
  { value: 'maria_lopez', label: 'María López' },
  { value: 'jose_hernandez', label: 'José Hernández' },
];

const mockTools = [
  { value: 'llave_ajustable', label: 'Llave ajustable' },
  { value: 'taladro', label: 'Taladro' },
  { value: 'multimetro', label: 'Multímetro' },
  { value: 'escalera', label: 'Escalera' },
  { value: 'equipo_seguridad', label: 'Equipo de seguridad' },
];

const mockSpareParts = [
  { value: 'cable_utp', label: 'Cable UTP' },
  { value: 'conector_rj45', label: 'Conector RJ45' },
  { value: 'cinta_aislante', label: 'Cinta aislante' },
  { value: 'tornillos', label: 'Tornillos' },
];

// Validation Schema
const workReportSchema = z.object({
  subsistema: z.string().min(1, "El subsistema es obligatorio"),
  ubicacion: z.string().min(1, "La ubicación es obligatoria"),
  fechaHoraInicio: z.string().min(1, "La fecha y hora de inicio son obligatorias"),
  turno: z.string(),
  frecuencia: z.string().min(1, "La frecuencia es obligatoria"),
  tipoMantenimiento: z.string().min(1, "El tipo de mantenimiento es obligatorio"),
  trabajadores: z.array(z.string()).min(1, "Debe seleccionar al menos un trabajador"),

  inspeccionRealizada: z.boolean(),
  observacionesActividad: z.string().optional(),
  evidencias: z.array(z.any()).optional(), // Using any for File objects for now

  herramientas: z.array(z.string()).optional(),
  refacciones: z.array(z.string()).optional(),

  observacionesGenerales: z.string().optional(),
  nombreResponsable: z.string().min(1, "El nombre del responsable es obligatorio"),
  firmaResponsable: z.string().nullable().refine((val) => val !== null, {
    message: "La firma es obligatoria",
  }),
  fechaHoraTermino: z.string().min(1, "La fecha y hora de término son obligatorias"),
}).refine((data) => {
  if (data.inspeccionRealizada && (!data.observacionesActividad || data.observacionesActividad.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Las observaciones son obligatorias si se realizó inspección",
  path: ["observacionesActividad"],
});

export type WorkReportFormValues = z.infer<typeof workReportSchema>;

export const NewWorkReportPage: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WorkReportFormValues>({
    resolver: zodResolver(workReportSchema) as any,
    defaultValues: {
      fechaHoraInicio: new Date().toISOString().slice(0, 16),
      turno: '',
      tipoMantenimiento: '',
      trabajadores: [],
      inspeccionRealizada: false,
      herramientas: [],
      refacciones: [],
      nombreResponsable: 'Juan Supervisor', // Mock user
      firmaResponsable: null,
    }
  });

  const fechaHoraInicio = watch('fechaHoraInicio');
  const inspeccionRealizada = watch('inspeccionRealizada');

  // Watch all values for preview
  const watchedValues = useWatch({ control });

  // Prepare values for preview component
  const previewValues = {
    subsistema: watchedValues.subsistema,
    ubicacion: watchedValues.ubicacion,
    fechaHoraInicio: watchedValues.fechaHoraInicio,
    turno: watchedValues.turno,
    frecuencia: watchedValues.frecuencia,
    trabajadores: watchedValues.trabajadores,

    inspeccionRealizada: watchedValues.inspeccionRealizada,
    observacionesActividad: watchedValues.observacionesActividad,
    evidenciasCount: watchedValues.evidencias?.length ?? 0,

    herramientas: watchedValues.herramientas,
    refacciones: watchedValues.refacciones,

    observacionesGenerales: watchedValues.observacionesGenerales,
    nombreResponsable: watchedValues.nombreResponsable,
    fechaHoraTermino: watchedValues.fechaHoraTermino,
    firmaResponsable: watchedValues.firmaResponsable,
  };

  // Auto-calculate shift
  useEffect(() => {
    if (fechaHoraInicio) {
      const date = new Date(fechaHoraInicio);
      const hour = date.getHours();
      let shift = 'Nocturno';

      if (hour >= 6 && hour < 14) {
        shift = 'Matutino';
      } else if (hour >= 14 && hour < 22) {
        shift = 'Vespertino';
      }

      setValue('turno', shift);

      // Auto-set end time to start time + 1 hour for convenience
      const endDate = new Date(date.getTime() + 60 * 60 * 1000);
      // Handle timezone offset for datetime-local input
      const offset = endDate.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(endDate.getTime() - offset)).toISOString().slice(0, 16);
      setValue('fechaHoraTermino', localISOTime);
    }
  }, [fechaHoraInicio, setValue]);

  // Auto-set start time on mount
  useEffect(() => {
    const currentStart = watch('fechaHoraInicio');
    if (!currentStart) {
      setValue('fechaHoraInicio', new Date().toISOString().slice(0, 16));
    }
  }, []);

  // Template Selection
  const subsistema = watch('subsistema');
  const tipoMantenimiento = watch('tipoMantenimiento');
  const frecuencia = watch('frecuencia');

  const { data: template } = useTemplateForReport({
    tipoReporte: 'work',
    subsistema,
    tipoMantenimiento,
    frecuencia
  });

  // Mutation
  const createReportMutation = useCreateWorkReportMutation();
  const router = useRouter();

  const onSubmit = async (data: WorkReportFormValues) => {
    // Auto-set end time
    const now = new Date().toISOString().slice(0, 16);
    data.fechaHoraTermino = now;
    
    // Convert evidences (File objects) to base64 or handle upload
    // For now, we'll just map them to their names or skip if they are Files, 
    // but ideally we should upload them first or convert to base64.
    // Let's convert to base64 for simplicity in this demo.
    const evidencesBase64 = await Promise.all(
      (data.evidences || []).map(async (file: any) => {
        if (file instanceof File) {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }
        return file;
      })
    );

    // Include templateId if available
    const payload = {
      ...data,
      evidencias: evidencesBase64,
      templateId: template?._id
    };

    console.log('Form Data Submitted:', payload);
    
    try {
      const result = await createReportMutation.mutateAsync(payload);
      alert('Reporte generado exitosamente');
      router.push(`/reports/${(result as any)._id}`);
    } catch (error) {
      console.error("Error creating report:", error);
      alert('Error al generar el reporte');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{formatoTrabajoSchema.name}</h1>
        <p className="text-gray-500">Llena el formato de trabajo para registrar la actividad realizada.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Section 1: General Data */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                <h2 className="text-lg font-semibold text-gray-800">Datos generales</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subsistema</label>
                  <select
                    {...register('subsistema')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subsistema ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccionar...</option>
                    {mockSubsystems.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.subsistema && <p className="mt-1 text-sm text-red-600">{errors.subsistema.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    {...register('ubicacion')}
                    placeholder="Ej. Estación A – Andén 2"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de inicio</label>
                  <input
                    type="datetime-local"
                    {...register('fechaHoraInicio')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fechaHoraInicio ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fechaHoraInicio && <p className="mt-1 text-sm text-red-600">{errors.fechaHoraInicio.message}</p>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                  <select
                    {...register('frecuencia')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.frecuencia ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccionar...</option>
                    {mockFrequencies.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.frecuencia && <p className="mt-1 text-sm text-red-600">{errors.frecuencia.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mantenimiento</label>
                  <select
                    {...register('tipoMantenimiento')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tipoMantenimiento ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Preventivo A">Preventivo A</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Inspección visual">Inspección visual</option>
                  </select>
                  {errors.tipoMantenimiento && <p className="mt-1 text-sm text-red-600">{errors.tipoMantenimiento.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <Controller
                    name="trabajadores"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        label="Trabajadores"
                        options={mockWorkers}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.trabajadores?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Activity */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                <h2 className="text-lg font-semibold text-gray-800">Actividad</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="inspeccionRealizada"
                    {...register('inspeccionRealizada')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inspeccionRealizada" className="font-medium text-gray-700">
                    Inspección realizada
                  </label>
                </div>

                {inspeccionRealizada && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones de la actividad</label>
                      <textarea
                        {...register('observacionesActividad')}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.observacionesActividad ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Describa los hallazgos o actividades realizadas..."
                      />
                      {errors.observacionesActividad && <p className="mt-1 text-sm text-red-600">{errors.observacionesActividad.message}</p>}
                    </div>

                    <div>
                      <Controller
                        name="evidencias"
                        control={control}
                        render={({ field }) => (
                          <ImageUpload
                            label="Evidencias fotográficas"
                            onChange={field.onChange}
                            error={errors.evidencias?.message as string}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Tools and Materials */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <h2 className="text-lg font-semibold text-gray-800">Herramientas y refacciones</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="herramientas"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Herramientas utilizadas"
                      options={mockTools}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Seleccionar herramientas..."
                    />
                  )}
                />

                <Controller
                  name="refacciones"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Refacciones utilizadas"
                      options={mockSpareParts}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Seleccionar refacciones..."
                    />
                  )}
                />
              </div>
            </section>

            {/* Section 4: Closure */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                <h2 className="text-lg font-semibold text-gray-800">Cierre</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones generales</label>
                  <textarea
                    {...register('observacionesGenerales')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comentarios finales..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del responsable</label>
                    <input
                      type="text"
                      {...register('nombreResponsable')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombreResponsable ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.nombreResponsable && <p className="mt-1 text-sm text-red-600">{errors.nombreResponsable.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de término</label>
                    <input
                      type="datetime-local"
                      {...register('fechaHoraTermino')}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fechaHoraTermino ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.fechaHoraTermino && <p className="mt-1 text-sm text-red-600">{errors.fechaHoraTermino.message}</p>}
                  </div>
                </div>

                <div>
                  <Controller
                    name="firmaResponsable"
                    control={control}
                    render={({ field }) => (
                      <SignaturePad
                        label="Firma del responsable"
                        onChange={field.onChange}
                        error={errors.firmaResponsable?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto px-8 py-3 text-lg"
                isLoading={isSubmitting}
              >
                <Save className="w-5 h-5 mr-2" />
                Generar reporte
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div>
          <WorkReportPreview values={previewValues} />
        </div>
      </div>
    </div>
  );
};

