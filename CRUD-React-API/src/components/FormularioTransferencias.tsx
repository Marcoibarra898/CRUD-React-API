import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Transferencia, Cuenta } from '../types';

interface TransferenciaFormProps {
  transferenciaId?: number;
  onBack: () => void;
}

export default function TransferenciaForm({ transferenciaId, onBack }: TransferenciaFormProps) {
  const [transferencia, setTransferencia] = useState<Transferencia>({
    cuentaOrigenId: 0,
    cuentaDestinoId: 0,
    monto: 0,
    concepto: '',
    estado: 'Pendiente'
  });
 
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [saldoDisponible, setSaldoDisponible] = useState(0);
 
  const esEdicion = !!transferenciaId;

  useEffect(() => {
    // Cargar cuentas para el selector
    const cargarCuentas = async () => {
      try {
        // impelementacion de la api pendiente
        const cuentasData = [
          { id: 1, numeroCuenta: '1234567890', tipoCuenta: 'Ahorro', banco: 'Banco ABC', saldo: 5000.50, activa: true, usuarioId: 1 },
          { id: 2, numeroCuenta: '0987654321', tipoCuenta: 'Corriente', banco: 'Banco XYZ', saldo: 12500.75, activa: true, usuarioId: 1 },
          { id: 3, numeroCuenta: '5678901234', tipoCuenta: 'Ahorro', banco: 'Banco DEF', saldo: 8750.25, activa: true, usuarioId: 2 }
        ];
        setCuentas(cuentasData);
      } catch (error) {
        console.error('Error al cargar cuentas:', error);
      }
    };

    cargarCuentas();

    if (esEdicion) {
      setCargando(true);
      // implementacion api para llamar transferencia pendiente
      setTimeout(() => {
        setTransferencia({
          id: transferenciaId,
          cuentaOrigenId: 1,
          cuentaDestinoId: 2,
          monto: 1500.00,
          concepto: 'Pago de servicios',
          fecha: new Date(),
          estado: 'Completada'
        });
        setCargando(false);
      }, 1000);
    }
  }, [transferenciaId, esEdicion]);

  // Actualizar saldo disponible cuando cambia la cuenta origen
  useEffect(() => {
    if (transferencia.cuentaOrigenId) {
      const cuentaOrigen = cuentas.find(cuenta => cuenta.id === transferencia.cuentaOrigenId);
      if (cuentaOrigen) {
        setSaldoDisponible(cuentaOrigen.saldo);
      }
    } else {
      setSaldoDisponible(0);
    }
  }, [transferencia.cuentaOrigenId, cuentas]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!transferencia.cuentaOrigenId) {
      nuevosErrores.cuentaOrigenId = 'Debe seleccionar una cuenta de origen';
    }
    
    if (!transferencia.cuentaDestinoId) {
      nuevosErrores.cuentaDestinoId = 'Debe seleccionar una cuenta de destino';
    }
    
    if (transferencia.cuentaOrigenId === transferencia.cuentaDestinoId && 
        transferencia.cuentaOrigenId !== 0) {
      nuevosErrores.cuentaDestinoId = 'La cuenta de destino debe ser diferente a la cuenta de origen';
    }
    
    if (transferencia.monto <= 0) {
      nuevosErrores.monto = 'El monto debe ser mayor que cero';
    }
    
    if (transferencia.monto > saldoDisponible) {
      nuevosErrores.monto = 'El monto excede el saldo disponible';
    }
    
    if (!transferencia.concepto.trim()) {
      nuevosErrores.concepto = 'El concepto es obligatorio';
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
      // implementacion de la api para guardar la transferencia pendiente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulando éxito para prueba
      alert(esEdicion ? 'Transferencia actualizada con éxito' : 'Transferencia realizada con éxito');
      onBack();
    } catch (error) {
      console.error('Error al procesar transferencia:', error);
      alert('Ocurrió un error al procesar la transferencia');
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Manejo especial para campos numéricos
    if (type === 'number') {
      setTransferencia({ ...transferencia, [name]: parseFloat(value) || 0 });
    } 
    // Manejo para los demás campos
    else {
      setTransferencia({ ...transferencia, [name]: value });
    }
    
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
        <h1 className="text-2xl font-bold">
          {esEdicion ? 'Editar Transferencia' : 'Nueva Transferencia'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta de Origen
              </label>
              <select
                name="cuentaOrigenId"
                value={transferencia.cuentaOrigenId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.cuentaOrigenId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={esEdicion}
              >
                <option value="">Seleccionar cuenta</option>
                {cuentas
                  .filter(cuenta => cuenta.activa)
                  .map(cuenta => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.numeroCuenta} - {cuenta.banco} ({cuenta.tipoCuenta}) - Saldo: ${cuenta.saldo.toFixed(2)}
                    </option>
                  ))}
              </select>
              {errores.cuentaOrigenId && (
                <p className="mt-1 text-sm text-red-600">{errores.cuentaOrigenId}</p>
              )}
              {transferencia.cuentaOrigenId > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  Saldo disponible: ${saldoDisponible.toFixed(2)}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuenta de Destino
              </label>
              <select
                name="cuentaDestinoId"
                value={transferencia.cuentaDestinoId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.cuentaDestinoId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={esEdicion}
              >
                <option value="">Seleccionar cuenta</option>
                {cuentas
                  .filter(cuenta => cuenta.activa && cuenta.id !== transferencia.cuentaOrigenId)
                  .map(cuenta => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.numeroCuenta} - {cuenta.banco} ({cuenta.tipoCuenta})
                    </option>
                  ))}
              </select>
              {errores.cuentaDestinoId && (
                <p className="mt-1 text-sm text-red-600">{errores.cuentaDestinoId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <input
                type="number"
                name="monto"
                value={transferencia.monto}
                onChange={handleChange}
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.monto ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={esEdicion}
              />
              {errores.monto && (
                <p className="mt-1 text-sm text-red-600">{errores.monto}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={transferencia.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!esEdicion}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concepto
              </label>
              <textarea
                name="concepto"
                value={transferencia.concepto}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errores.concepto ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={esEdicion}
              ></textarea>
              {errores.concepto && (
                <p className="mt-1 text-sm text-red-600">{errores.concepto}</p>
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
                  {esEdicion ? 'Actualizando...' : 'Procesando...'}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {esEdicion ? 'Actualizar' : 'Realizar Transferencia'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}