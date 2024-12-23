import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Para formato en español
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IconButton, TextField } from "@mui/material";

export const PromotionRequirements = ({
  system,
  promotionRequirements = {
    isRecurrent: false,
    promotionDuration: "",
    rewards: [],
    startDate: "",
    endDate: "",
    daysOfWeek: [],
  },
  setPromotionRequirements,
}) => {
  const [rewards, setRewards] = useState(promotionRequirements.rewards || []);
  const [newReward, setNewReward] = useState({ points: "", description: "" });

  useEffect(() => {
    setPromotionRequirements((prev) => ({
      ...prev,
      rewards: rewards,
    }));
  }, [rewards, setPromotionRequirements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionRequirements((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(promotionRequirements);
  };

  const handleRecurrentChange = (e) => {
    setPromotionRequirements((prev) => ({
      ...prev,
      isRecurrent: e.target.checked,
    }));
  };

  const handleRewardChange = (e) => {
    const { name, value } = e.target;
    setNewReward((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const addReward = () => {
    if (newReward.points.trim() && newReward.description.trim()) {
      setRewards((prev) => [...prev, newReward]);
      setNewReward({ points: "", description: "" });
    }
  };

  const removeReward = (index) => {
    const updatedRewards = rewards.filter((_, i) => i !== index);
    setRewards(updatedRewards);
  };

  const daysMap = [
    { name: "Lunes", value: 1 },
    { name: "Martes", value: 2 },
    { name: "Miércoles", value: 3 },
    { name: "Jueves", value: 4 },
    { name: "Viernes", value: 5 },
    { name: "Sábado", value: 6 },
    { name: "Domingo", value: 7 },
  ];

  const canSubmit = rewards.length > 0;
  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const handleDateChange = (date, field) => {
    setPromotionRequirements((prev) => ({
      ...prev,
      [field]: date ? dayjs(date) : null, // Asegura que siempre sea una instancia válida de dayjs
    }));
  };
  const renderCustomInput = (params, pickerRef) => (
    <TextField
      {...params}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <IconButton edge='end' onClick={() => pickerRef.current.openPicker()}>
            <CalendarTodayIcon />
          </IconButton>
        ),
      }}
      className='w-full'
      inputProps={{
        ...params.inputProps,
        placeholder: "DD/MM/YYYY", // Placeholder personalizado
        onClick: () => pickerRef.current.openPicker(), // Abre el picker al hacer clic en el input
      }}
    />
  );
  return (
    <motion.form initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='space-y-4'>
      <h2 className='text-2xl font-bold text-main mb-4'>Requisitos de la promoción</h2>

      {system === "visits" && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
          <div>
            <label htmlFor='startDate' className='block text-sm font-medium mb-2'>
              Inicio de la promoción
            </label>
            <DateTimePicker
              ref={startPickerRef}
              id='startDate'
              value={promotionRequirements.startDate || null}
              onChange={(date) => handleDateChange(date, "startDate")}
              className='w-full'
              minDate={dayjs()} // Deshabilita fechas anteriores a hoy
              format='DD/MM/YYYY' // Formato personalizado
              renderInput={(params) => renderCustomInput(params, startPickerRef)}
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='endDate' className='block text-sm font-medium mb-2'>
              Fin de la promoción
            </label>
            <DateTimePicker
              ref={endPickerRef}
              id='endDate'
              value={promotionRequirements.endDate || null}
              onChange={(date) => handleDateChange(date, "endDate")}
              className='w-full'
              minDate={promotionRequirements.startDate || dayjs()} // Deshabilita fechas antes del inicio
              format='DD/MM/YYYY' // Formato personalizado
              renderInput={(params) => renderCustomInput(params, endPickerRef)}
            />
          </div>
        </LocalizationProvider>
      )}

      {system === "visits" && (
        <div>
          <label className='block text-sm font-medium mb-2'>Días de la semana en que aplica</label>
          <div className='flex flex-wrap gap-2'>
            {daysMap.map((day) => (
              <label key={day.value} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name='daysOfWeek'
                  value={day.value}
                  checked={promotionRequirements.daysOfWeek.includes(day.value)}
                  onChange={(e) => {
                    const { value, checked } = e.target;
                    const numericValue = parseInt(value, 10);

                    setPromotionRequirements((prev) => {
                      const updatedDays = checked
                        ? [...prev.daysOfWeek, numericValue] // Agrega el día si está seleccionado
                        : prev.daysOfWeek.filter((d) => d !== numericValue); // Remueve el día si no está seleccionado

                      return {
                        ...prev,
                        daysOfWeek: updatedDays,
                      };
                    });
                    console.log(promotionRequirements);
                  }}
                  className='hidden peer'
                />
                <span className='flex items-center justify-center w-6 h-6 border-2 border-main rounded-md peer-checked:bg-main peer-checked:text-white transition duration-200'>
                  {promotionRequirements.daysOfWeek.includes(day.value) && "✔"}
                </span>
                {day.name}
              </label>
            ))}
          </div>
        </div>
      )}
      {system === "visits" && (
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='isRecurrent'
            name='isRecurrent'
            checked={promotionRequirements.isRecurrent || false}
            onChange={handleRecurrentChange}
            className='w-4 h-4 p-2 border bg-white border-main rounded-md'
          />
          <label htmlFor='isRecurrent' className='text-sm font-small'>
            ¿Es recurrente? Es decir si el beneficio se puede canjear varias veces y se repetirá durante la duración de la promoción.
          </label>
        </div>
      )}
      {system === "points" && (
        <div>
          <label htmlFor='promotionDuration' className='block text-sm font-medium mb-2'>
            Duración de los puntos
          </label>
          <input
            id='promotionDuration'
            name='promotionDuration'
            type='number'
            value={promotionRequirements.promotionDuration}
            onChange={handleChange}
            className='w-full p-4 h-12 border bg-white border-main rounded-md'
            placeholder='Tiempo en que los clientes deben realizar al menos un canje antes de que los puntos se pierdan.'
          />
        </div>
      )}
      {system === "points" && (
        <div className='flex flex-col mt-4 space-y-2 mb-2 m-auto justify-center text-center'>
          <label htmlFor='rewardPoints' className='block mb-2 text-sm font-medium text-left'>
            Cantidad de puntos - Descripción recompensa
          </label>
          <div className='flex flex-col w-full gap-2 justify-center m-auto'>
            <div className='space-x-0'>
              <input
                name='points'
                type='number'
                value={newReward.points.trim()}
                onChange={handleRewardChange}
                className='w-full  mr-6  p-4 h-12 border  bg-white border-main rounded-md'
                placeholder='Puntos'
                min='0'
              />
              <textarea
                name='description'
                type='text'
                value={newReward.description}
                onChange={handleRewardChange}
                className='w-full mr-6 mt-2 p-4 h-12 border  bg-white border-main rounded-md'
                placeholder='Descripción de la recompensa'
              />
            </div>
            <div>
              <button type='button' onClick={addReward} className='bg-main text-white px-4 w-full py-2 rounded-md'>
                Añadir recompensa
              </button>
            </div>
          </div>

          <ul className='space-y-2 mt-4'>
            {rewards.map((reward, index) => (
              <li key={index} className='flex justify-between items-center'>
                <span>
                  {reward.points} puntos - {reward.description}
                </span>
                <button
                  type='button'
                  onClick={() => removeReward(index)}
                  className='border-2 bg-white border-main hover:boder-none hover:bg-main hover:text-white transition transform duration-500'
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.form>
  );
};
