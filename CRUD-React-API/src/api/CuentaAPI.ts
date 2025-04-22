import api from "./index";

// Definir la interfaz para el objeto Cuenta
export interface Cuenta {
  id?: number;
  usuarioId: number;
  numeroCuenta: string;
  saldo: number;
  tipoCuenta: string;
  fechaCreacion?: string;
  estado?: boolean;
}

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
export const getCuentaById = async (id: number): Promise<Cuenta> => {
  try {
    const response = await api.get(`/cuentas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la cuenta con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva cuenta
export const createCuenta = async (cuenta: Cuenta): Promise<Cuenta> => {
  try {
    const response = await api.post("/cuentas", cuenta);
    return response.data;
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    throw error;
  }
};

// Actualizar una cuenta existente
export const updateCuenta = async (
  id: number,
  cuenta: Cuenta
): Promise<Cuenta> => {
  try {
    const response = await api.put(`/cuentas/${id}`, cuenta);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la cuenta con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una cuenta
export const deleteCuenta = async (id: number): Promise<void> => {
  try {
    await api.delete(`/cuentas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la cuenta con ID ${id}:`, error);
    throw error;
  }
};

// Obtener cuentas por ID de usuario
export const getCuentasByUsuarioId = async (
  usuarioId: number
): Promise<Cuenta[]> => {
  try {
    const response = await api.get(`/cuentas?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener las cuentas del usuario ${usuarioId}:`,
      error
    );
    throw error;
  }
};

// Actualizar saldo de una cuenta
export const updateSaldo = async (
  id: number,
  saldo: number
): Promise<Cuenta> => {
  try {
    const cuenta = await getCuentaById(id);
    cuenta.saldo = saldo;
    const response = await api.patch(`/cuentas/${id}`, { saldo });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el saldo de la cuenta ${id}:`, error);
    throw error;
  }
};

export default {
  getCuentas,
  getCuentaById,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  getCuentasByUsuarioId,
  updateSaldo,
};
