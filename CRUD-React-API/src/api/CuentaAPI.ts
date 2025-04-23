import api from "./index";
import { Cuenta } from "../types";

// Obtener todas las cuentas
export const getCuentas = async (): Promise<Cuenta[]> => {
  try {
    const response = await api.get("/cuentas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las cuentas:", error);
    throw error;
  }
};

// Obtener una cuenta por su ID
export const getCuentaPorId = async (id: number): Promise<Cuenta> => {
  try {
    const response = await api.get(`/cuentas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la cuenta con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva cuenta
export const crearCuenta = async (cuenta: Cuenta): Promise<Cuenta> => {
  try {
    const response = await api.post("/cuentas", cuenta);
    return response.data;
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    throw error;
  }
};

// Actualizar una cuenta existente
export const actualizarCuenta = async (
  id: number,
  cuenta: Partial<Cuenta>
): Promise<Cuenta> => {
  try {
    const response = await api.patch(`/cuentas/${id}`, cuenta);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la cuenta con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una cuenta
export const eliminarCuenta = async (id: number): Promise<void> => {
  try {
    await api.delete(`/cuentas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la cuenta con ID ${id}:`, error);
    throw error;
  }
};


export default {
  getCuentas,
  getCuentaPorId,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta,
};
