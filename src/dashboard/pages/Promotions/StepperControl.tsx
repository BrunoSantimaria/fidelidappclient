import React, { useState } from "react";

export const StepperControl = ({ handleClick, currentStep, steps, isNextDisabled, handleSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    if (currentStep === steps.length) {
      setLoading(true);
      await handleSubmit();
      setLoading(false);
    } else {
      handleClick("next");
    }
  };

  return (
    <div className='flex justify-around mt-6 mb-6'>
      <button
        className={`${currentStep === 1 ? "hidden" : "cursor-pointer"} w-32 py-2 bg-gray-300 cursor-pointer rounded-lg text-main`}
        onClick={() => handleClick("previous")}
        disabled={currentStep === 1}
      >
        Anterior
      </button>

      {/* Botón de "Siguiente" o "Enviar" */}
      <button
        className={`w-32 py-2 ${isNextDisabled || loading ? "bg-gray-300" : "bg-main"} text-white rounded-lg`}
        onClick={handleButtonClick}
        disabled={isNextDisabled || loading}
      >
        {loading ? "Enviando..." : currentStep === steps.length ? "Enviar" : "Siguiente"}
      </button>
    </div>
  );
};
