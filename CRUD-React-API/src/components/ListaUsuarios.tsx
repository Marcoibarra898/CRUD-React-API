import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, User } from "lucide-react";
import { Usuario } from "../types";
import {  getUsuarios, eliminarUsuario as eliminarUsuarioAPI } from "../api/UsuarioAPI";

interface ListaUsuariosProps {
  onAdd: () => void;
  onEdit: (id: number) => void;
}

export default function ListaUsuarios({ onAdd, onEdit }: ListaUsuariosProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        const data = await getUsuarios();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("No se pudieron cargar los usuarios. Intente nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarUsuario = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        setCargando(true);
        await eliminarUsuarioAPI(id);
        setUsuarios(usuarios.filter((u) => u.id !== id));
        setError(null);
      } catch (err) {
        console.error(`Error al eliminar el usuario con ID ${id}:`, err);
        setError("No se pudo eliminar el usuario. Intente nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Usuarios</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-black"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400 "
              size={18}
            />
          </div>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        {usuario.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">
                              {usuario.nombre} {usuario.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {usuario.email}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {usuario.telefono || "N/A"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              usuario.id !== undefined && onEdit(usuario.id)
                            }
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => usuario.id !== undefined && eliminarUsuario(usuario.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}