import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const CampaignTable = ({ campaigns }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 4,
        maxHeight: 450, // Set the maximum height for the table container
        overflow: "auto", // Enable scrolling for overflowing content
      }}
    >
      <Table stickyHeader> {/* Use stickyHeader for fixed headers during scroll */}
        <TableHead>
          <TableRow>
            <TableCell><strong>Nombre Campaña</strong></TableCell>
            <TableCell ><strong>Mensaje</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
            <TableCell><strong>Fecha</strong></TableCell>
            <TableCell><strong>Enviados</strong></TableCell>
            <TableCell><strong>Fallidos</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell sx={{ maxWidth: '300px'}}>
                  {campaign.message}
                </TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>{campaign.createdAt.slice(0, 10)}</TableCell>
                <TableCell>{campaign.metrics.sent}</TableCell>
                <TableCell>{campaign.metrics.failed}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography>No campaigns found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CampaignTable;
