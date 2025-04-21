export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaRegistro?: Date;
    cuentas?: Cuenta[];
  }
  
  export interface Cuenta {
    id?: number;
    numeroCuenta: string;
    tipoCuenta: string;
    banco: string;
    saldo: number;
    activa: boolean;
    usuarioId: number;
    usuario?: Usuario;
    transferenciasEnviadas?: Transferencia[];
    transferenciasRecibidas?: Transferencia[];
  }
  
  export interface Transferencia {
    id?: number;
    cuentaOrigenId: number;
    cuentaDestinoId: number;
    cuentaOrigen?: Cuenta;
    cuentaDestino?: Cuenta;
    monto: number;
    concepto: string;
    fecha?: Date;
    estado: string;
  }

  export interface EstadisticasDashboard {
    totalUsuarios: number;
    totalCuentas: number;
    totalTransferencias: number;
    saldoTotal: number;
    transferenciasPorEstado: Array<{name: string; value: number}>;
    ultimasTransferencias: Transferencia[];
  }