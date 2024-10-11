import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export const ClientList = ({ clients }) => {
  console.log(clients);

  if (!clients.length)
    return (
      <section className='shadow-md shadow-neutral-200 w-[95%] bg-gradient-to-br from-gray-100 to-main/30 p-6 rounded-md'>
        <div className='flex flex-col space-y-6'>
          <span className='text-center text-lg text-black/60'>Aún no se registraron clientes a la promoción.</span>
        </div>
      </section>
    );

  return (
    <div className='w-[90%] m-auto'>
      <span className='flex text-lg mb-6'>Lista de clientes.</span>
      <TableContainer component={Paper}>
        <Table aria-label='client list table'>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell> {/* Nueva columna para el nombre */}
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>ID del Cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.name}</TableCell> {/* Renderizado del nombre */}
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell>{client.id}</TableCell> {/* Columna Tarjeta (ID) */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
