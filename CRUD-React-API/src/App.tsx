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

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const navigateTo = (view: string, id?: number) => {
    setCurrentView(view);
    setEditId(id);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNewTransfer={() => navigateTo("nuevaTransferencia")} />;
      case "cuentas":
        return (
          <ListaCuentas
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
          <TransferenciaForm onBack={() => navigateTo("transferencias")} />
        );
      case "editarTransferencia":
        return (
          <TransferenciaForm
            transferenciaId={editId}
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
        return <Dashboard onNewTransfer={() => navigateTo("nuevaTransferencia")} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto text-black">{renderContent()}</div>
    </div>
  );
}

export default App;
