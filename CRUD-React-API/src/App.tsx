import { useState } from "react";
import { Users, CreditCard, ArrowRightLeft, BarChart3 } from "lucide-react";
import "./App.css";

import Dashboard from "./components/dashboard";
import CuentaForm from "./components/FormularioCuentas";
import TransferenciaForm from "./components/FormularioTransferencias";
import UsuarioForm from "./components/FormularioUsuario";
import ListaCuentas from "./components/ListaCuentas";
import ListaTransferencias from "./components/ListaTransferencias";
import ListaUsuarios from "./components/ListaUsuarios";

import { Cuenta } from "./types";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [editId, setEditId] = useState<number | undefined>(undefined);

  // Estado global para cuentas
  const [cuentas, setCuentas] = useState<Cuenta[]>([
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
      activa: true,
      usuarioId: 2,
    },
  ]);

  // Lógica de transferencia
  const handleTransferencia = (
    cuentaOrigenId: number,
    cuentaDestinoId: number,
    monto: number
  ) => {
    setCuentas((prevCuentas) =>
      prevCuentas.map((cuenta) => {
        if (cuenta.id === cuentaOrigenId) {
          return { ...cuenta, saldo: cuenta.saldo - monto };
        }
        if (cuenta.id === cuentaDestinoId) {
          return { ...cuenta, saldo: cuenta.saldo + monto };
        }
        return cuenta;
      })
    );
  };

  const navigateTo = (view: string, id?: number) => {
    setCurrentView(view);
    setEditId(id);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "cuentas":
        return (
          <ListaCuentas
            cuentasData={cuentas}
            onAdd={() => navigateTo("nuevaCuenta")}
            onEdit={(id: number) => navigateTo("editarCuenta", id)}
          />
        );
      case "nuevaCuenta":
        return <CuentaForm onBack={() => navigateTo("cuentas")} />;
      case "editarCuenta":
        return (
          <CuentaForm cuentaId={editId} onBack={() => navigateTo("cuentas")} />
        );
      case "transferencias":
        return (
          <ListaTransferencias
            onAdd={() => navigateTo("nuevaTransferencia")}
            onEdit={(id: number) => navigateTo("editarTransferencia", id)}
          />
        );
      case "nuevaTransferencia":
        return (
          <TransferenciaForm
            cuentasData={cuentas}
            onTransferencia={handleTransferencia}
            onBack={() => navigateTo("transferencias")}
          />
        );
      case "editarTransferencia":
        return (
          <TransferenciaForm
            transferenciaId={editId}
            cuentasData={cuentas}
            onTransferencia={handleTransferencia}
            onBack={() => navigateTo("transferencias")}
          />
        );
      case "usuarios":
        return (
          <ListaUsuarios
            onAdd={() => navigateTo("nuevoUsuario")}
            onEdit={(id: number) => navigateTo("editarUsuario", id)}
          />
        );
      case "nuevoUsuario":
        return <UsuarioForm onBack={() => navigateTo("usuarios")} />;
      case "editarUsuario":
        return (
          <UsuarioForm
            usuarioId={editId}
            onBack={() => navigateTo("usuarios")}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">
            Sistema Financiero
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigateTo("dashboard")}
                className={`flex items-center w-full p-2 rounded-md ${
                  currentView === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <BarChart3 size={18} className="mr-2" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo("cuentas")}
                className={`flex items-center w-full p-2 rounded-md ${
                  currentView.includes("cuenta")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <CreditCard size={18} className="mr-2" />
                Cuentas
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo("transferencias")}
                className={`flex items-center w-full p-2 rounded-md ${
                  currentView.includes("transferencia")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <ArrowRightLeft size={18} className="mr-2" />
                Transferencias
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo("usuarios")}
                className={`flex items-center w-full p-2 rounded-md ${
                  currentView.includes("usuario")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Users size={18} className="mr-2" />
                Usuarios
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
}

export default App;
