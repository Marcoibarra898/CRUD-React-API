import api from "./index";

export interface Transferencia {
  id?: number;
  cuentaOrigenId: number;
  cuentaDestinoId: number;
  monto: number;
  fecha?: string;
  descripcion?: string;
  estado?: string;
}

// Obtener todas las transferencias
export const getTransferencias = async (): Promise<Transferencia[]> => {
  try {
    const response = await api.get("/transferencias");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las transferencias:", error);
    throw error;
  }
};

// Obtener una transferencia por ID
export const getTransferenciaPorId = async (
  id: number
): Promise<Transferencia> => {
  try {
    const response = await api.get(`/transferencias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la transferencia con ID ${id}:`, error);
    throw error;
  }
};
