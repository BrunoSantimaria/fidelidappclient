import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";

// Utility function to format dates
const formatDate = (date) => new Date(date).toLocaleDateString("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Table Component
const ClientPromotionsTable = ({ clientPromotions, onRedirect }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Título</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Visitas / Puntos</TableCell>
            <TableCell align="center">Requerido</TableCell>
            <TableCell align="center">Tipo</TableCell>
            <TableCell align="center">Fin de Vigencia</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientPromotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="bold">{promo.title}</Typography>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      promo.status === "Active" ? "bg-green-500" : promo.status === "Inactive" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  />
                  <Typography variant="body2">{promo.status}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                {promo.systemType === "points" ? promo.pointsEarned : promo.actualVisits}
              </TableCell>
              <TableCell align="center">{promo.visitsRequired || "N/A"}</TableCell>
              <TableCell align="center">{promo.systemType}</TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <CalendarIcon fontSize="small" />
                  <Typography variant="body2">{formatDate(promo.endDate)}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => onRedirect(promo.id)}
                >
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientPromotionsTable;
