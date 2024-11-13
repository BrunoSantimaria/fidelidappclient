import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";

export const PointsChart = ({ pointsPerDay }) => {
  // Estructura de los datos para el gráfico
  const pointsData = pointsPerDay.map((item) => ({
    day: dayjs(item.date).format("DD/MM/YYYY"),
    points: item.points,
  }));

  // Arrays para el eje X e Y
  const days = pointsData.map((data) => data.day);
  const points = pointsData.map((data) => data.points);

  return (
    <div className='flex md:-mx-10 lg:-mx-10' style={{ width: "100%", height: 350 }}>
      <BarChart
        borderRadius={10}
        xAxis={[
          {
            data: days,
            scaleType: "band",
          },
        ]}
        yAxis={[
          {
            tickNumber: 10,
            tickMinStep: 1,
          },
        ]}
        series={[
          {
            data: points,
            label: "Puntos",
            color: "#5b7898",
          },
        ]}
        width={1000}
        height={350}
      />
    </div>
  );
};
