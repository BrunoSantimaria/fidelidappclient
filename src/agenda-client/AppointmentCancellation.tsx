import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";

const AppointmentCancellation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/api/agenda/appointments/cancel-token/${token}`);
        setAppointment(response.data);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Error al cargar la cita");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [token]);

  const handleCancellation = async () => {
    setProcessing(true);
    try {
      await api.post(`/api/agenda/appointments/cancel-token/${token}`);
      navigate(`/appointment-result?status=cancelled`);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cancelar la cita");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <div className='text-red-500 text-center mb-4'>
            <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h2 className='text-center text-xl font-semibold text-gray-900 mb-4'>Error</h2>
          <p className='text-center text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Cancelación de Cita</h2>
          <p className='text-gray-600'>¿Estás seguro que deseas cancelar esta cita?</p>
        </div>

        <div className='bg-gray-50 rounded-lg p-6 mb-8'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Detalles de la cita:</h3>
          <dl className='space-y-3'>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Nombre</dt>
              <dd className='mt-1 text-sm text-gray-900'>{appointment?.clientName}</dd>
            </div>
            <div>
              <dt className='text-sm font-medium text-gray-500'>Fecha y hora</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {appointment?.startTime &&
                  new Date(appointment.startTime).toLocaleString("es-ES", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
              </dd>
            </div>
            {appointment?.numberOfPeople > 1 && (
              <div>
                <dt className='text-sm font-medium text-gray-500'>Número de personas</dt>
                <dd className='mt-1 text-sm text-gray-900'>{appointment.numberOfPeople}</dd>
              </div>
            )}
            {appointment?.notes && (
              <div>
                <dt className='text-sm font-medium text-gray-500'>Notas</dt>
                <dd className='mt-1 text-sm text-gray-900'>{appointment.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className='flex flex-col space-y-4'>
          <button
            onClick={handleCancellation}
            disabled={processing}
            className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
          >
            {processing ? "Procesando..." : "Confirmar Cancelación"}
          </button>
          <button
            onClick={() => navigate(-1)}
            disabled={processing}
            className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCancellation;
