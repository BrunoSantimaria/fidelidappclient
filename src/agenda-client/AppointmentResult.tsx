import { useSearchParams, Link } from "react-router-dom";

const AppointmentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const resultConfig = {
    confirm: {
      title: "¡Cita Confirmada!",
      message: "Tu cita ha sido confirmada exitosamente. Te esperamos en la fecha y hora acordada.",
      icon: (
        <svg className='mx-auto h-12 w-12 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
        </svg>
      ),
      buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    cancel: {
      title: "Cita Cancelada",
      message: "Tu cita ha sido cancelada exitosamente. Si deseas reagendar, por favor realiza una nueva reserva.",
      icon: (
        <svg className='mx-auto h-12 w-12 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      ),
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    cancelled: {
      title: "Cita Cancelada",
      message: "Tu cita ha sido cancelada exitosamente. Si deseas reagendar, por favor realiza una nueva reserva.",
      icon: (
        <svg className='mx-auto h-12 w-12 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      ),
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    rejected: {
      title: "Cita Rechazada",
      message: "Lo sentimos, tu cita ha sido rechazada. Por favor, intenta agendar en otro horario disponible.",
      icon: (
        <svg className='mx-auto h-12 w-12 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      ),
      buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    error: {
      title: "Error",
      message: "Ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo nuevamente.",
      icon: (
        <svg className='mx-auto h-12 w-12 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      ),
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
  };

  const config = resultConfig[status] || {
    title: "Estado Desconocido",
    message: "Ha ocurrido un error al procesar tu solicitud.",
    icon: (
      <svg className='mx-auto h-12 w-12 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    ),
    buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
        <div className='mb-6'>{config.icon}</div>

        <h2 className='text-2xl font-bold text-gray-900 mb-4'>{config.title}</h2>

        <p className='text-gray-600 mb-8'>{config.message}</p>

        <Link
          to='/'
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${config.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default AppointmentResult;
