import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Users, CreditCard, ArrowRightLeft, Wallet, Plus } from "lucide-react";
import { EstadisticasDashboard, Transferencia } from "../types";
import { getUsuarios } from "../api/UsuarioAPI";
import { getCuentas } from "../api/CuentaAPI";
import { getTransferencias } from "../api/TransferenciaAPI";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface DashboardProps {
  onNewTransfer: () => void;
}

// Helper function para agrupar transferencias por mes con tipos correctos
const agruparTransferenciasPorMes = (transferencias: Transferencia[]) => {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const transferenciasAgrupadas = meses.map(mes => ({ mes, transferencias: 0 }));
  
  transferencias.forEach((transferencia: Transferencia) => {
    const fecha = new Date(transferencia.fecha ?? 0);
    const mesIndex = fecha.getMonth();
    transferenciasAgrupadas[mesIndex].transferencias += 1;
  });
  
  // Obtener solo los últimos 4 meses con datos
  const mesesConDatos = transferenciasAgrupadas.filter(item => item.transferencias > 0);
  return mesesConDatos.slice(-4); // Últimos 4 meses con transferencias
};

export default function Dashboard({ onNewTransfer }: DashboardProps) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard>({
    totalUsuarios: 0,
    totalCuentas: 0,
    totalTransferencias: 0,
    saldoTotal: 0,
    transferenciasPorEstado: [
      { name: "Pendiente", value: 0 },
      { name: "Completada", value: 0 },
      { name: "Rechazada", value: 0 },
    ],
    ultimasTransferencias: [],
  });

  const [datosMensuales, setDatosMensuales] = useState<{mes: string; transferencias: number}[]>([
    { mes: "Ene", transferencias: 0 },
    { mes: "Feb", transferencias: 0 },
    { mes: "Mar", transferencias: 0 },
    { mes: "Abr", transferencias: 0 },
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  // Cargar datos reales desde las APIs
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de todas las APIs
        const [usuarios, cuentas, transferencias] = await Promise.all([
          getUsuarios(),
          getCuentas(),
          getTransferencias()
        ]);
        
        // Calcular estadísticas
        const saldoTotal = cuentas.reduce((total, cuenta) => total + parseFloat(cuenta.saldo.toString()), 0);
        
        // Contar transferencias por estado
        const pendientes = transferencias.filter(t => t.estado === "Pendiente").length;
        const completadas = transferencias.filter(t => t.estado === "Completada").length;
        const rechazadas = transferencias.filter(t => t.estado === "Rechazada").length;
        
        // Ordenar transferencias por fecha (más recientes primero)
        const transferenciasOrdenadas = [...transferencias].sort((a, b) => 
          new Date(b.fecha ?? 0).getTime() - new Date(a.fecha ?? 0).getTime()
        );
        
        // Tomar las 3 más recientes
        const ultimasTransferencias = transferenciasOrdenadas.slice(0, 3);
        
        // Actualizar el estado con los datos reales
        setEstadisticas({
          totalUsuarios: usuarios.length,
          totalCuentas: cuentas.length,
          totalTransferencias: transferencias.length,
          saldoTotal: saldoTotal,
          transferenciasPorEstado: [
            { name: "Pendiente", value: pendientes },
            { name: "Completada", value: completadas },
            { name: "Rechazada", value: rechazadas },
          ],
          ultimasTransferencias: ultimasTransferencias,
        });
        
        // Actualizar datos mensuales
        setDatosMensuales(agruparTransferenciasPorMes(transferencias));
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos para el dashboard:", err);
        setError("No se pudieron cargar los datos. Por favor, intenta más tarde.");
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="p-2 sm:p-4 md:p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Dashboard</h1>

      {/* Cards de estadísticas - Móvil: una columna, Tablet: dos columnas, Desktop: cuatro columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex items-center">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
            <Users size={18} className="text-blue-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-gray-500 text-xs sm:text-sm">Usuarios</p>
            <p className="text-base sm:text-xl font-semibold text-black">
              {estadisticas.totalUsuarios}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex items-center">
          <div className="bg-green-100 p-2 sm:p-3 rounded-full">
            <CreditCard size={18} className="text-green-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-gray-500 text-xs sm:text-sm">Cuentas</p>
            <p className="text-base sm:text-xl font-semibold text-black">
              {estadisticas.totalCuentas}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex items-center">
          <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
            <ArrowRightLeft size={18} className="text-yellow-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-gray-500 text-xs sm:text-sm">Transferencias</p>
            <p className="text-base sm:text-xl font-semibold text-black">
              {estadisticas.totalTransferencias}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 flex items-center">
          <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
            <Wallet size={18} className="text-purple-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-gray-500 text-xs sm:text-sm">Saldo Total</p>
            <p className="text-base sm:text-xl font-semibold text-black">
              ${estadisticas.saldoTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos - Móvil: una columna, Desktop: dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Transferencias por Estado
          </h2>
          <div className="h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadisticas.transferenciasPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    window.innerWidth < 640
                      ? `${(percent * 100).toFixed(0)}%`
                      : `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {estadisticas.transferenciasPorEstado.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Transferencias Mensuales
          </h2>
          <div className="h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosMensuales}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px", marginTop: "8px" }} />
                <Bar dataKey="transferencias" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Últimas transferencias */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-3 sm:p-4 border-b flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-semibold">
            Últimas Transferencias
          </h2>
          <button 
            onClick={onNewTransfer}
            className="flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-800">
            <Plus size={16} className="mr-1" /> Nueva Transferencia
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Concepto
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {estadisticas.ultimasTransferencias.map((t, i) => (
                <tr key={i}>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    {t.id}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    {new Date(t.fecha ?? 0).toLocaleDateString()}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                    ${t.monto.toLocaleString()}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell">
                    {t.concepto}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.estado === "Completada"
                          ? "bg-green-100 text-green-800"
                          : t.estado === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}