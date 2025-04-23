import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Usuario } from '../types';
import { 
  getUsuarioPorId,
  crearUsuario,
  actualizarUsuario 
} from '../api/UsuarioAPI';

interface UsuarioFormProps {
  usuarioId?: number;
  onBack: () => void;
}

export default function UsuarioForm({ usuarioId, onBack }: UsuarioFormProps) {
  const [usuario, setUsuario] = useState<Usuario>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  const esEdicion = !!usuarioId;

  useEffect(() => {
    const cargarUsuario = async () => {
      if (esEdicion && usuarioId) {
        try {
          setCargando(true);
          const data = await getUsuarioPorId(usuarioId);
          setUsuario({
            ...data,
            telefono: data.telefono || ''
          });
          setError(null);
        } catch (err) {
          console.error(`Error al cargar el usuario con ID ${usuarioId}:`, err);
          setError('No se pudo cargar la información del usuario');
        } finally {
          setCargando(false);
        }
      }
    };

    cargarUsuario();
  }, [usuarioId, esEdicion]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }
    
    if (!usuario.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio';
    }
    
    if (!usuario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    
    if (!usuario.telefono?.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
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
      if (esEdicion && usuario.id) {
        await actualizarUsuario(usuario.id, usuario);
      } else {
        await crearUsuario(usuario);
      }
      
      setError(null);
      alert(esEdicion ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito');
      onBack();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError('Ocurrió un error al guardar el usuario');
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    
    // Limpiar error al cambiar el valor
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-black">
          {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errores.nombre && (
                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={usuario.apellido}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.apellido ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errores.apellido && (
                <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errores.email && (
                <p className="mt-1 text-sm text-red-600">{errores.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={usuario.telefono || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.telefono ? 'border-red-500' : 'border-gray-300'
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
