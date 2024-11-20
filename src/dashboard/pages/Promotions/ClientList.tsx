import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { useNavigateTo } from "../../../hooks/useNavigateTo";
import { useState } from "react";

// Mapa de estado traducido
const statusMap = {
  Active: "Activo",
  Redeemed: "Canjeado",
  Expired: "Expirado",
  Pending: "Pendiente",
};

export const ClientList = ({ clients, promotion }) => {
  const { handleNavigate } = useNavigateTo();
  console.log("Clientes:", clients); // Log para ver los datos de los clientes
  console.log("Promoción:", promotion); // Log para ver los datos de la promoción

  // Estado para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedClients = clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Verificamos el tipo de promoción al principio
  const isPointsBased = promotion.systemType === "points";
  const isVisitsBased = promotion.systemType === "visits";

  // Agregar logs para verificar los tipos
  console.log("isPointsBased:", isPointsBased); // Log para verificar si es un sistema de puntos
  console.log("isVisitsBased:", isVisitsBased); // Log para verificar si es un sistema de visitas

  if (!clients.length)
    return (
      <section className='shadow-md shadow-neutral-200 w-[95%] mt-10 border-t-4 border-t-main border-black/20 border-1 p-6 rounded-md'>
        <div className='flex flex-col space-y-6'>
          <span className='text-center text-lg text-black/60'>Aún no se registraron clientes a la promoción.</span>
        </div>
      </section>
    );

  return (
    <div className='w-[90%] m-auto'>
      <span className='flex text-lg mb-6'>Lista de clientes</span>
      <TableContainer component={Paper}>
        <Table aria-label='client list table'>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Estado</TableCell>
              {isPointsBased && <TableCell>Puntos</TableCell>} {/* Mostrar columna de Puntos */}
              {isVisitsBased && <TableCell>Visitas</TableCell>} {/* Mostrar columna de Visitas */}
              <TableCell>Fidelicard</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{statusMap[client.status]}</TableCell> {/* Traducción del estado */}
                {isPointsBased && (
                  <TableCell>{client.totalPoints}</TableCell> // Mostrar puntos si el sistema es por puntos
                )}
                {isVisitsBased && (
                  <TableCell>{client.totalVisits || "0"}</TableCell> // Mostrar visitas si el sistema es por visitas
                )}
                <TableCell className=''>
                  <div
                    onClick={() => {
                      handleNavigate(`/promotions/${client.id}/${promotion._id}/`);
                    }}
                    className='flex flex-row p-2 bg-main w-fit text-white rounded-md cursor-pointer group hover:bg-main/90 hover:duration-300'
                  >
                    <CreditCardRoundedIcon className='group' />
                    <span className='relative top-0.5 ml-2 group'>Ver</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component='div'
        count={clients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Filas por página'
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
      />
    </div>
  );
};
