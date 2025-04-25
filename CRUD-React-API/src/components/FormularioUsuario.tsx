import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader } from "lucide-react";
import { Usuario } from "../types";

interface UsuarioFormProps {
  usuarioId?: number;
  onBack: () => void;
  onSave: (usuario: Usuario) => void;
}

export default function UsuarioForm({
  usuarioId,
  onBack,
  onSave,
}: UsuarioFormProps) {
  const [usuario, setUsuario] = useState<Usuario>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const esEdicion = !!usuarioId;

  useEffect(() => {
    if (esEdicion) {
      setCargando(true);
      // Simulamos obtener datos del usuario por ID
      setTimeout(() => {
        setUsuario({
          id: usuarioId,
          nombre: "Juan",
          apellido: "Pérez",
          email: "juan.perez@example.com",
          telefono: "123456789",
          fechaRegistro: new Date(2023, 5, 15), // Aseguramos que haya una fecha
        });
        setCargando(false);
      }, 1000);
    }
  }, [usuarioId, esEdicion]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!usuario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }

    if (!usuario.email.trim()) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      nuevosErrores.email = "El email no es válido";
    }

    if (!usuario.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Si es nuevo usuario, asegurar que no haya id para que App.tsx lo asigne
      // y agregue la fecha de registro
      const usuarioActualizado = esEdicion
        ? { ...usuario }
        : {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
          };

      // Llamar a la función onSave para comunicar el usuario guardado
      onSave(usuarioActualizado);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Ocurrió un error al guardar el usuario");
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });

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
    <div className="p-6 bg-gray-50">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {esEdicion ? "Editar Usuario" : "Nuevo Usuario"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                  errores.nombre ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.nombre && (
                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={usuario.apellido}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                  errores.apellido ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.apellido && (
                <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                  errores.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.email && (
                <p className="mt-1 text-sm text-red-600">{errores.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={usuario.telefono}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white ${
                  errores.telefono ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errores.telefono && (
                <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onBack}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
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
