import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export const VisitCharts = () => {
  // Datos ficticios de visitas por día
  const visitData = [
    { day: "Lunes", visits: 30 },
    { day: "Martes", visits: 50 },
    { day: "Miércoles", visits: 20 },
    { day: "Jueves", visits: 40 },
    { day: "Viernes", visits: 60 },
    { day: "Sábado", visits: 80 },
    { day: "Domingo", visits: 45 },
  ];

  // Extraer los nombres de los días y las visitas
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
