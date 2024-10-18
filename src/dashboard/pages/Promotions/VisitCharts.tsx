import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";

export const VisitCharts = ({ promotions }) => {
  console.log(promotions);

  // Verificar si hay promociones y mapear los datos
  const visitData =
    promotions?.map((item) => ({
      day: dayjs(item.date).format("DD/MM/YYYY"), // Formatear la fecha
      visits: item.visits,
    })) || [];

  // Extraer los nombres de los días (fechas en este caso) y las visitas
  const days = visitData.map((data) => data.day);
  const visits = visitData.map((data) => data.visits);

  return (
    <div className='flex md:-mx-10 lg:-mx-10' style={{ width: "100%", height: 350 }}>
      <BarChart
        borderRadius={10}
        xAxis={[
          {
            data: days,
            scaleType: "band", // Establecer el tipo de escala en "band" para los gráficos de barras
          },
        ]}
        yAxis={[
          {
            tickNumber: 10, // Forzar un número fijo de ticks para el eje Y
            tickMinStep: 1, // Asegurar que los ticks sean enteros
          },
        ]}
        series={[
          {
            data: visits,
            label: "Visitas",
            color: "#5b7898",
          },
        ]}
        width={1000}
        height={350}
      />
    </div>
  );
};
