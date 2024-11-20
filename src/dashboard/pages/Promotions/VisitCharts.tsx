import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";

export const VisitCharts = ({ promotions }) => {
  console.log(promotions);
  const visitData =
    promotions?.map((item) => ({
      day: dayjs(item.date).format("DD/MM/YYYY"),
      visits: item.visits,
    })) || [];

  const days = visitData.map((data) => data.day);
  const visits = visitData.map((data) => data.visits);

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
