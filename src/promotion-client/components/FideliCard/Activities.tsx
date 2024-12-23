import { Alert, Pagination } from "@mui/material";
import { useState } from "react";

export const Activities = ({ activities }) => {
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular el índice inicial y final de las actividades para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  // Cambiar la página actual
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return activities.length > 0 ? (
    <div>
      {currentActivities.map((activity) => (
        <div
          key={activity._id} // Usamos _id como clave única
          className='flex justify-between items-center text-sm bg-white shadow-md shadow-black/20 rounded-lg p-3  border border-gray-200 mb-2'
        >
          <div className='w-2/3'>
            <span className='text-gray-700 font-medium '>{activity.description}</span>
            <br />
            <span className='text-xs text-gray-500'>
              {new Date(activity.date).toLocaleString("es-CL", {
                timeZone: "America/Santiago",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
          </div>
          {/* Condicional para mostrar puntos solo si no es una actividad de tipo "visit" */}
          {activity.type !== "visit" && (
            <span className={`font-bold ${activity.type === "earned" ? "text-green-600" : "text-red-600"}`}>
              {activity.amount === 0 ? "Gratis" : activity.type === "earned" ? `+${activity.amount} pts` : `-${activity.amount} pts`}
            </span>
          )}
        </div>
      ))}

      {/* Paginación */}
      <Pagination
        count={Math.ceil(activities.length / itemsPerPage)} // Número total de páginas
        page={currentPage} // Página actual
        onChange={handleChangePage} // Manejar cambio de página
        color='primary'
        variant='outlined'
        shape='rounded'
        siblingCount={1}
        boundaryCount={1}
        className='mt-4 flex justify-center'
        // Personalización de los textos en español
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "0.875rem", // Tamaño del texto
          },
        }}
      />
    </div>
  ) : (
    <Alert severity='info'>No hay actividades recientes.</Alert>
  );
};
