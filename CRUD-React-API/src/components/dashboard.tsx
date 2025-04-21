import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, CreditCard, ArrowRightLeft, Wallet, Plus } from 'lucide-react';
import { EstadisticasDashboard } from '../types';

// Datos de ejemplo - implementacion de los metodos de la api pendiente
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
    const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard>({
        totalUsuarios: 0,
        totalCuentas: 0,
        totalTransferencias: 0,
        saldoTotal: 0,
        transferenciasPorEstado: [
            { name: 'Pendiente', value: 0 },
            { name: 'Completada', value: 0 },
            { name: 'Rechazada', value: 0 }
        ],
        ultimasTransferencias: [] 
    });

  // Simular carga de datos
  useEffect(() => {
    // implementacion de la api pendiente para las estadisticas reales
    setEstadisticas({
      totalUsuarios: 24,
      totalCuentas: 36,
      totalTransferencias: 120,
      saldoTotal: 45680.25,
      transferenciasPorEstado: [
        { name: 'Pendiente', value: 15 },
        { name: 'Completada', value: 95 },
        { name: 'Rechazada', value: 10 }
      ],
      ultimasTransferencias: [
        { id: 1, cuentaOrigenId: 1, cuentaDestinoId: 2, fecha: new Date('2025-04-19'), monto: 1200, concepto: 'Pago de servicios', estado: 'Completada' },
        { id: 2, cuentaOrigenId: 1, cuentaDestinoId: 3, fecha: new Date('2025-04-20'), monto: 500, concepto: 'Transferencia personal', estado: 'Completada' },
        { id: 3, cuentaOrigenId: 2, cuentaDestinoId: 1, fecha: new Date('2025-04-21'), monto: 350, concepto: 'Pago de factura', estado: 'Pendiente' }
      ]
    });
  }, []);

  // Datos para gráfico de barras
  const datosMensuales = [
    { mes: 'Ene', transferencias: 65 },
    { mes: 'Feb', transferencias: 59 },
    { mes: 'Mar', transferencias: 80 },
    { mes: 'Abr', transferencias: 81 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Usuarios</p>
            <p className="text-xl font-semibold">{estadisticas.totalUsuarios}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CreditCard className="text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Cuentas</p>
            <p className="text-xl font-semibold">{estadisticas.totalCuentas}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full">
            <ArrowRightLeft className="text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Transferencias</p>
            <p className="text-xl font-semibold">{estadisticas.totalTransferencias}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full">
            <Wallet className="text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Saldo Total</p>
            <p className="text-xl font-semibold">${estadisticas.saldoTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transferencias por Estado</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadisticas.transferenciasPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {estadisticas.transferenciasPorEstado.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transferencias Mensuales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosMensuales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="transferencias" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Últimas transferencias */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Últimas Transferencias</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <Plus size={16} className="mr-1" /> Nueva Transferencia
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {estadisticas.ultimasTransferencias.map((t, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 whitespace-nowrap">{t.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{t.fecha ? t.fecha.toLocaleDateString() : ''}</td>
                  <td className="py-3 px-4 whitespace-nowrap">${t.monto.toLocaleString()}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{t.concepto}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.estado === 'Completada' ? 'bg-green-100 text-green-800' : 
                      t.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
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