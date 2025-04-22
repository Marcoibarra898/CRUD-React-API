import api from "./index";

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol?: string;
  fechaRegistro?: string;
  estado?: boolean;
}

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUsuarioPorId = async (id: number): Promise<Usuario> => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (usuario: Usuario): Promise<Usuario> => {
  try {
    const response = await api.post("/usuarios", usuario);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (
  id: number,
  usuario: Partial<Usuario>
): Promise<Usuario> => {
  try {
    const response = await api.patch(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Autenticar usuario
export const autenticarUsuario = async (
  email: string,
  password: string
): Promise<{ usuario: Usuario; token: string }> => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    throw error;
  }
};

export default {
  getUsuarios,
  getUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  autenticarUsuario,
};
