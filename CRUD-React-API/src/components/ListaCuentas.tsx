import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, CreditCard, Eye } from "lucide-react";

// Definición de tipos
const cuentasEjemplo = [
  {
    id: 1,
    numeroCuenta: "1234567890",
    tipoCuenta: "Ahorro",
    banco: "Banco ABC",
    saldo: 5000.5,
    activa: true,
    usuarioId: 1,
  },
  {
    id: 2,
    numeroCuenta: "0987654321",
    tipoCuenta: "Corriente",
    banco: "Banco XYZ",
    saldo: 12500.75,
    activa: true,
    usuarioId: 1,
  },
  {
    id: 3,
    numeroCuenta: "5678901234",
    tipoCuenta: "Ahorro",
    banco: "Banco DEF",
    saldo: 8750.25,
    activa: false,
    usuarioId: 2,
  },
];

export default function ListaCuentasResponsivo() {
  const [cuentas, setCuentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      setCuentas(cuentasEjemplo);
      setCargando(false);
    }, 1000);
  }, []);

  const cuentasFiltradas = cuentas.filter(
    (cuenta) =>
      cuenta.numeroCuenta.includes(busqueda) ||
      cuenta.banco.toLowerCase().includes(busqueda.toLowerCase()) ||
      cuenta.tipoCuenta.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminarCuenta = (id) => {
    // Simulando eliminación
    if (window.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) {
      setCuentas(cuentas.filter((c) => c.id !== id));
    }
  };

  const onAdd = () => alert("Agregar nueva cuenta");
  const onEdit = (id) => alert(`Editar cuenta ${id}`);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold">Cuentas Bancarias</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center w-full sm:w-auto justify-center"
        >
          <Plus size={16} className="mr-2" />
          Nueva Cuenta
        </button>
      </div>

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
          <>
            {/* Vista para móviles */}
            <div className="block md:hidden">
              {cuentasFiltradas.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {cuentasFiltradas.map((cuenta) => (
                    <div key={cuenta.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <CreditCard size={14} className="text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {cuenta.numeroCuenta}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cuenta.banco}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Tipo:</span>{" "}
                          {cuenta.tipoCuenta}
                        </div>
                        <div>
                          <span className="text-gray-500">Saldo:</span> $
                          {cuenta.saldo.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <div>
                          <span className="text-gray-500">Estado:</span>
                          <span
                            className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              cuenta.activa
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cuenta.activa ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Usuario ID:</span>{" "}
                          {cuenta.usuarioId}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded">
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          onClick={() => onEdit(cuenta.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          onClick={() => eliminarCuenta(cuenta.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-4 text-center text-gray-500">
                  No se encontraron cuentas
                </div>
              )}
            </div>

            {/* Vista para tablets y escritorio */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
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
                        <td className="py-3 px-4 whitespace-nowrap">
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          {cuenta.tipoCuenta}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {cuenta.banco}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium">
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          {cuenta.usuarioId}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Eye size={18} />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => onEdit(cuenta.id)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => eliminarCuenta(cuenta.id)}
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
          </>
        )}
      </div>
    </div>
  );
}
