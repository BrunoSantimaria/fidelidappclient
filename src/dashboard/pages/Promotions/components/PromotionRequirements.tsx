import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const PromotionRequirements = ({
  system,
  promotionRequirements = {
    isRecurrent: false,
    visitsRequired: 0,
    promotionDuration: "",
    rewards: [],
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
      [name]: value,
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

  // Verificar si las recompensas son necesarias para el envío
  const canSubmit = rewards.length > 0;
  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.form initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='space-y-4'>
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
          <label htmlFor='isRecurrent' className='text-sm font-medium'>
            ¿Es recurrente?
          </label>
        </div>
      )}

      {system === "visits" && (
        <div>
          <label htmlFor='visitsRequired' className='block text-sm font-medium'>
            Visitas necesarias
          </label>
          <input
            id='visitsRequired'
            name='visitsRequired'
            type='number'
            value={promotionRequirements.visitsRequired}
            onChange={handleChange}
            className='w-full p-2 border bg-white border-main rounded-md'
            placeholder='Número de visitas'
          />
        </div>
      )}

      <div>
        <label htmlFor='promotionDuration' className='block text-sm font-medium'>
          Duración de la promoción
        </label>
        <input
          id='promotionDuration'
          name='promotionDuration'
          type='text'
          value={promotionRequirements.promotionDuration}
          onChange={handleChange}
          className='w-full p-2 border bg-white border-main rounded-md'
          placeholder='Duración en días'
        />
      </div>

      {system === "points" && (
        <div className='space-y-2'>
          <label htmlFor='rewardPoints' className='block text-sm font-medium'>
            Cantidad de puntos - Descripción recompensa
          </label>
          <div className='flex gap-2'>
            <input
              name='points'
              type='number'
              value={newReward.points}
              onChange={handleRewardChange}
              className='w-1/2 p-2 border border-main bg-white rounded-md'
              placeholder='Puntos'
            />
            <input
              name='description'
              type='text'
              value={newReward.description}
              onChange={handleRewardChange}
              className='w-1/2 p-2 border border-main bg-white rounded-md'
              placeholder='Descripción de la recompensa'
            />
            <button type='button' onClick={addReward} className='bg-main text-white px-4 py-2 rounded-md'>
              Añadir recompensa
            </button>
          </div>

          <ul className='space-y-2 mt-4'>
            {rewards.map((reward, index) => (
              <li key={index} className='flex justify-between items-center'>
                <span>
                  {reward.points} puntos - {reward.description}
                </span>
                <button type='button' onClick={() => removeReward(index)} className='text-red-500 hover:text-red-700'>
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
