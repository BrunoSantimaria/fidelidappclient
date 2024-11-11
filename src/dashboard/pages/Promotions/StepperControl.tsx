import React from "react";

export const StepperControl = ({ handleClick, currentStep, steps, isNextDisabled, handleSubmit }) => {
  // Función que maneja el click en el botón siguiente o anterior
  const handleButtonClick = () => {
    if (currentStep === steps.length) {
      // Si estamos en el último paso, ejecutar handleSubmit
      handleSubmit();
    } else {
      // Si no, solo cambiar al siguiente paso
      handleClick("next");
    }
  };

  return (
    <div className='flex justify-around mt-6'>
      <button className='w-32 py-2 bg-gray-300 rounded-lg text-main' onClick={() => handleClick("previous")} disabled={currentStep === 1}>
        Anterior
      </button>

      {/* Botón de "Siguiente" o "Enviar" */}
      <button className={`w-32 py-2 ${isNextDisabled ? "bg-gray-300" : "bg-main"} text-white rounded-lg`} onClick={handleButtonClick} disabled={isNextDisabled}>
        {currentStep === steps.length ? "Enviar" : "Siguiente"}
      </button>
    </div>
  );
};
