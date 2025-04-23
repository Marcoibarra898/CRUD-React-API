import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, CreditCard, Eye } from "lucide-react";
import { Cuenta } from "../types";
import { 
  getCuentas, 
  eliminarCuenta as eliminarCuentaAPI 
} from "../api/CuentaAPI";

interface ListaCuentasProps {
  onAdd: () => void;
  onEdit: (id: number) => void;
}

export default function ListaCuentas({ onAdd, onEdit }: ListaCuentasProps) {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        setCargando(true);
        const data = await getCuentas();
        setCuentas(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar cuentas:", err);
        setError("No se pudieron cargar las cuentas. Intente nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarCuentas();
  }, []);

  const cuentasFiltradas = cuentas.filter(
    (cuenta) =>
      cuenta.numeroCuenta.includes(busqueda) ||
      cuenta.banco.toLowerCase().includes(busqueda.toLowerCase()) ||
      cuenta.tipoCuenta.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarCuenta = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) {
      try {
        setCargando(true);
        await eliminarCuentaAPI(id);
        setCuentas(cuentas.filter((c) => c.id !== id));
        setError(null);
      } catch (err) {
        console.error(`Error al eliminar la cuenta con ID ${id}:`, err);
        setError("No se pudo eliminar la cuenta. Intente nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Cuentas Bancarias</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Nueva Cuenta
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
              placeholder="Buscar cuentas..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
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
            <table className="w-full text-sm text-gray-800 bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banco
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cuentasFiltradas.length > 0 ? (
                  cuentasFiltradas.map((cuenta) => (
                    <tr key={cuenta.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <CreditCard size={14} className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {cuenta.numeroCuenta}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-900">
                        {cuenta.tipoCuenta}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-900">
                        {cuenta.banco}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">
                        $
                        {cuenta.saldo.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            cuenta.activa
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cuenta.activa ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-900">
                        {cuenta.usuarioId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-800">
                            <Eye size={18} />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              cuenta.id !== undefined && onEdit(cuenta.id)
                            }
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => cuenta.id !== undefined && eliminarCuenta(cuenta.id)}
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
                      colSpan={7}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No se encontraron cuentas
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