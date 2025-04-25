import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader } from "lucide-react";
import { Cuenta, Usuario } from "../types";
import { getCuentaPorId, crearCuenta, actualizarCuenta } from "../api/CuentaAPI";
import api from "../api/index";

interface CuentaFormProps {
  cuentaId?: number;
  onBack: () => void;
}

export default function CuentaForm({ cuentaId, onBack }: CuentaFormProps) {
  const [cuenta, setCuenta] = useState<Cuenta>({
    numeroCuenta: "",
    tipoCuenta: "Ahorro",
    banco: "",
    saldo: 0,
    activa: true,
    usuarioId: 0,
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const esEdicion = !!cuentaId;

  useEffect(() => {
    // Cargar usuarios para el selector
    const cargarUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    cargarUsuarios();

    if (esEdicion && cuentaId) {
      const cargarCuenta = async () => {
        try {
          setCargando(true);
          const cuentaData = await getCuentaPorId(cuentaId);
          setCuenta(cuentaData);
        } catch (error) {
          console.error(`Error al cargar la cuenta con ID ${cuentaId}:`, error);
          alert("No se pudo cargar la información de la cuenta");
        } finally {
          setCargando(false);
        }
      };

      cargarCuenta();
    }
  }, [cuentaId, esEdicion]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!cuenta.numeroCuenta.trim()) {
      nuevosErrores.numeroCuenta = "El número de cuenta es obligatorio";
    }

    if (!cuenta.banco.trim()) {
      nuevosErrores.banco = "El banco es obligatorio";
    }

    if (cuenta.saldo < 0) {
      nuevosErrores.saldo = "El saldo no puede ser negativo";
    }

    if (!cuenta.usuarioId) {
      nuevosErrores.usuarioId = "Debe seleccionar un usuario";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      if (esEdicion && cuenta.id) {
        await actualizarCuenta(cuenta.id, cuenta);
        alert("Cuenta actualizada con éxito");
      } else {
        await crearCuenta(cuenta);
        alert("Cuenta creada con éxito");
      }
      onBack();
    } catch (error) {
      console.error("Error al guardar cuenta:", error);
      alert("Ocurrió un error al guardar la cuenta");
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Manejo especial para checkboxes
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setCuenta({ ...cuenta, [name]: checkbox.checked });
    }
    // Manejo especial para campos numéricos
    else if (type === "number") {
      setCuenta({ ...cuenta, [name]: parseFloat(value) || 0 });
    }
    // Manejo para los demás campos
    else {
      setCuenta({ ...cuenta, [name]: value });
    }

    // Limpiar error al cambiar el valor
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="mr-3 sm:mr-4 p-1 sm:p-2 rounded-full hover:bg-gray-100"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="sm:text-lg" />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
          {esEdicion ? "Editar Cuenta" : "Nueva Cuenta"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-5 md:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-black">
                Número de Cuenta
              </label>
              <input
                type="text"
                name="numeroCuenta"
                value={cuenta.numeroCuenta}
                onChange={handleChange}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-md text-black  ${
                  errores.numeroCuenta ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.numeroCuenta && (
                <p className="mt-1 text-xs text-red-600">
                  {errores.numeroCuenta}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-black">
                Tipo de Cuenta
              </label>
              <select
                name="tipoCuenta"
                value={cuenta.tipoCuenta}
                onChange={handleChange}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md text-black"
              >
                <option value="Ahorro">Ahorro</option>
                <option value="Corriente">Corriente</option>
                <option value="Nómina">Nómina</option>
                <option value="Inversión">Inversión</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-black">
                Banco
              </label>
              <input
                type="text"
                name="banco"
                value={cuenta.banco}
                onChange={handleChange}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-md text-black ${
                  errores.banco ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.banco && (
                <p className="mt-1 text-xs text-red-600">{errores.banco}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-black">
                Saldo
              </label>
              <input
                type="number"
                name="saldo"
                value={cuenta.saldo}
                onChange={handleChange}
                step="0.01"
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-md text-black ${
                  errores.saldo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.saldo && (
                <p className="mt-1 text-xs text-red-600">{errores.saldo}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-black">
                Usuario
              </label>
              <select
                name="usuarioId"
                value={cuenta.usuarioId}
                onChange={handleChange}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-md  text-black ${
                  errores.usuarioId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido} ({usuario.email})
                  </option>
                ))}
              </select>
              {errores.usuarioId && (
                <p className="mt-1 text-xs text-red-600">{errores.usuarioId}</p>
              )}
            </div>

            <div className="flex items-center sm:col-span-2 md:col-span-1 text-black">
              <input
                type="checkbox"
                id="activa"
                name="activa"
                checked={cuenta.activa}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="activa"
                className="ml-2 block text-xs sm:text-sm text-gray-700"
              >
                Cuenta Activa
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0">
            <button
              type="button"
              onClick={onBack}
              className="sm:mr-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}