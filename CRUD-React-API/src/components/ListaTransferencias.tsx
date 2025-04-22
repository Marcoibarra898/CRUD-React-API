import { useState, useEffect } from "react";
import { Eye, Edit, Plus, Search, Ban, CheckCheck } from "lucide-react";
import { Transferencia } from "../types";

interface ListaTransferenciasProps {
  onAdd: () => void;
  onEdit: (id: number) => void;
}

export default function ListaTransferencias({
  onAdd,
  onEdit,
}: ListaTransferenciasProps) {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    // implementar llamado a la api pendiente
    setTimeout(() => {
      setTransferencias([
        {
          id: 1,
          cuentaOrigenId: 1,
          cuentaDestinoId: 2,
          monto: 1500.0,
          concepto: "Pago de servicios",
          fecha: new Date("2025-04-15"),
          estado: "Completada",
        },
        {
          id: 2,
          cuentaOrigenId: 2,
          cuentaDestinoId: 3,
          monto: 2500.5,
          concepto: "Transferencia personal",
          fecha: new Date("2025-04-18"),
          estado: "Pendiente",
        },
        {
          id: 3,
          cuentaOrigenId: 1,
          cuentaDestinoId: 3,
          monto: 750.25,
          concepto: "Pago de factura",
          fecha: new Date("2025-04-20"),
          estado: "Rechazada",
        },
      ]);
      setCargando(false);
    }, 1000);
  }, []);

  const cambiarEstadoTransferencia = (id: number, nuevoEstado: string) => {
    // llamado a la api para cambiar el estado de la transferencia pendiente
    setTransferencias(
      transferencias.map((t) =>
        t.id === id ? { ...t, estado: nuevoEstado } : t
      )
    );
  };

  const transferenciasFiltradas = transferencias.filter((transferencia) => {
    const coincideBusqueda =
      transferencia.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
      transferencia.id?.toString().includes(busqueda) ||
      transferencia.monto.toString().includes(busqueda);

    const coincideEstado =
      filtroEstado === "Todos" || transferencia.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transferencias</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Nueva Transferencia
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-2 md:mb-0">
              <input
                type="text"
                placeholder="Buscar transferencias..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-gray-800">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desde
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hacia
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transferenciasFiltradas.length > 0 ? (
                  transferenciasFiltradas.map((transferencia) => (
                    <tr key={transferencia.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">
                        {transferencia.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">
                        {transferencia.cuentaOrigenId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">
                        {transferencia.cuentaDestinoId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-800">
                        $
                        {transferencia.monto.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">
                        {transferencia.concepto}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">
                        {transferencia.fecha?.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transferencia.estado === "Completada"
                              ? "bg-green-100 text-green-800"
                              : transferencia.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transferencia.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-800">
                            <Eye size={18} />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => onEdit(transferencia.id!)}
                          >
                            <Edit size={18} />
                          </button>
                          {transferencia.estado === "Pendiente" && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-800"
                                onClick={() =>
                                  cambiarEstadoTransferencia(
                                    transferencia.id!,
                                    "Completada"
                                  )
                                }
                                title="Aprobar transferencia"
                              >
                                <CheckCheck size={18} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  cambiarEstadoTransferencia(
                                    transferencia.id!,
                                    "Rechazada"
                                  )
                                }
                                title="Rechazar transferencia"
                              >
                                <Ban size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No se encontraron transferencias
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
