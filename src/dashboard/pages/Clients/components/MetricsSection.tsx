import React from "react";
import { Typography } from "@mui/material";

const MetricsSection = ({ totalClients }) => {
    return (
        <section className='w-full'>
            <div className='w-[95%] flex flex-col m-auto justify-between'>
                <div className='flex flex-col items-center m-auto w-[95%] space-y-2'>
                    <Typography variant='h4' className='text-2xl font-bold text-center'>
                        Conoce tus Clientes
                    </Typography>
                    <Typography variant="h6" className='text-center'>
                        Total Clients: <strong>{totalClients}</strong>
                    </Typography>
                </div>
            </div>
        </section>

    );
};

export default MetricsSection;
