export type WarehouseItem = {
    id: string;
    name: string;
    units: number;
    observations: string;
    evidences: {
        id: string;
        previewUrl: string;
    }[];
};

export type WarehouseReport = {
    subsistema: string;
    fechaHoraEntrega: Date;
    turno: string;

    nombreQuienRecibe: string;
    nombreAlmacenista: string;

    herramientas: WarehouseItem[];
    refacciones: WarehouseItem[];

    observacionesGenerales: string;

    fechaHoraRecepcion: Date;
    nombreQuienEntrega: string;
    nombreAlmacenistaCierre: string; // can be same as nombreAlmacenista for now

    firmaQuienRecibe?: string;       // dataURL from SignaturePad (optional for now)
    firmaAlmacenista?: string;
    firmaQuienEntrega?: string;
};
