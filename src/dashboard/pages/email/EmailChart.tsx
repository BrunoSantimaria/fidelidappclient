import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { Paper, Box, Typography } from "@mui/material";

export const EmailsChart = () => {
  // Datos ficticios para los correos enviados en los últimos 30 días
  const data = [
    { date: "01/10", emails: 15 },
    { date: "02/10", emails: 25 },
    { date: "03/10", emails: 30 },
    { date: "04/10", emails: 45 },
    { date: "05/10", emails: 50 },
    { date: "06/10", emails: 30 },
    { date: "07/10", emails: 20 },
    { date: "08/10", emails: 25 },
    { date: "09/10", emails: 35 },
    { date: "10/10", emails: 40 },
    { date: "11/10", emails: 55 },
    { date: "12/10", emails: 60 },
    { date: "13/10", emails: 20 },
    { date: "14/10", emails: 40 },
    { date: "15/10", emails: 45 },
    { date: "16/10", emails: 50 },
    { date: "17/10", emails: 60 },
    { date: "18/10", emails: 70 },
    { date: "19/10", emails: 75 },
    { date: "20/10", emails: 60 },
    { date: "21/10", emails: 50 },
    { date: "22/10", emails: 40 },
    { date: "23/10", emails: 30 },
    { date: "24/10", emails: 20 },
    { date: "25/10", emails: 15 },
    { date: "26/10", emails: 10 },
    { date: "27/10", emails: 20 },
    { date: "28/10", emails: 30 },
    { date: "29/10", emails: 35 },
    { date: "30/10", emails: 40 },
  ];

  // Calculamos el total de correos enviados
  const totalEmailsSent = data.reduce((acc, curr) => acc + curr.emails, 0);

  return (
    <div className=' w-[95%] m-auto'>
      <Typography variant='h6' gutterBottom>
        Cantidad de Correos Enviados - Último Mes: {totalEmailsSent}
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='emails' stroke='#75c5c5' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};
