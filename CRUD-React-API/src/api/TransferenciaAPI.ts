import api from "./index";
import { Transferencia } from "../types";


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

// Obtener una transferencia por su ID
export const getTransferenciaPorId = async (id: number): Promise<Transferencia> => {
  try {
    const response = await api.get(`/transferencias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la transferencia con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva transferencia
export const crearTransferencia = async (transferencia: {
  cuentaOrigenId: number;
  cuentaDestinoId: number;
  monto: number;
  concepto: string;
}): Promise<Transferencia> => {
  try {
    const response = await api.post("/transferencias", transferencia);
    return response.data;
  } catch (error) {
    console.error("Error al crear la transferencia:", error);
    throw error;
  }
};

// Actualizar una transferencia existente
export const actualizarTransferencia = async (
  id: number,
  datos: {
    concepto?: string;
    estado?: string;
  }
): Promise<Transferencia> => {
  try {
    const response = await api.patch(`/transferencias/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la transferencia con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una transferencia
export const eliminarTransferencia = async (id: number): Promise<void> => {
  try {
    await api.delete(`/transferencias/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la transferencia con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getTransferencias,
  getTransferenciaPorId,
  crearTransferencia,
  actualizarTransferencia,
  eliminarTransferencia,
};