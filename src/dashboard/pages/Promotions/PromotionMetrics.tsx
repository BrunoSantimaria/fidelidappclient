import React from "react";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
export const PromotionMetrics = ({ metrics }) => {
  console.log(metrics);

  const isPointsBased = metrics?.systemType === "points"; // Verifica si es sistema de puntos

  return (
    <section className='flex flex-col md:flex-row lg:flex-row justify-between xs:flex-col w-[95%] gap-6'>
      <div className='transition-transform transform hover:scale-105 w-full md:max-w-[20%] lg:max-w-[20%] relative flex flex-col shadow-md bg-gradient-to-br from-gray-50 to-main/15 space-y-4 p-6 rounded-md m-0 text-left'>
        <PeopleAltRoundedIcon style={{ color: "#4caf50" }} />
        <span>Clientes Activos</span>
        <span>{metrics?.statistics.ActiveClients}</span>
      </div>

      <div className='transition-transform transform hover:scale-105 w-full md:max-w-[20%] lg:max-w-[20%] flex flex-col shadow-md bg-gradient-to-br from-gray-50 to-main/15 space-y-4 p-6 rounded-md m-0 text-left'>
        <PersonOffRoundedIcon style={{ color: "#FF5722" }} />
        <span>Clientes Expirados</span>
        <span>{metrics?.statistics.ExpiredClients}</span>
      </div>

      <div className='transition-transform transform hover:scale-105 w-full md:max-w-[20%] lg:max-w-[20%] flex flex-col shadow-md bg-gradient-to-br from-gray-50 to-main/15 space-y-4 p-6 rounded-md m-0 text-left'>
        <RedeemRoundedIcon style={{ color: "#FFC107" }} />
        <span>Promociones Canjeadas</span>
        <span>{metrics?.statistics.RedeemedClients}</span>
      </div>

      <div className='transition-transform transform hover:scale-105 w-full md:max-w-[20%] lg:max-w-[20%] flex flex-col shadow-md bg-gradient-to-br from-gray-50 to-main/15 space-y-4 p-6 rounded-md m-0 text-left'>
        <GroupRoundedIcon style={{ color: "#2196F3" }} />
        <span>Total Clientes</span>
        <span>{metrics?.statistics.TotalClients}</span>
      </div>

      {/* Si el sistema es de puntos, muestra los puntos, de lo contrario, muestra las visitas */}
      <div className='transition-transform transform hover:scale-105 w-full md:max-w-[20%] lg:max-w-[20%] flex flex-col shadow-md bg-gradient-to-br from-gray-50 to-main/15 space-y-4 p-6 rounded-md m-0 text-left'>
        {isPointsBased ? <SavingsRoundedIcon style={{ color: "#9C27B0" }} /> : <DirectionsWalkRoundedIcon style={{ color: "#9C27B0" }} />}
        <span>{isPointsBased ? "Total Puntos" : "Total Visitas"}</span>
        <span>{isPointsBased ? metrics?.statistics.TotalPoints : metrics?.statistics.TotalVisit}</span>
      </div>
    </section>
  );
};
