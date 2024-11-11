import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"; // Importa Framer Motion

export const StepperPromotion = ({ steps, currentStep }) => {
  const [newStep, setNewStep] = useState([]);
  const stepRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
      } else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
      } else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
      }
      count++;
    }
    return newSteps;
  };

  useEffect(() => {
    const stepsState = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));
    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step, index) => (
    <div key={index} className={index !== newStep.length - 1 ? "w-full flex items-center" : "flex items-center"}>
      <div className='relative flex flex-col items-center text-teal-600'>
        <motion.div
          initial={{ scale: 1 }} // Estado inicial de escala
          animate={{ scale: step.selected || step.completed ? 1.2 : 1 }} // Escala animada
          transition={{ type: "spring", stiffness: 300, damping: 20 }} // Configuración de la animación
          className={`rounded-full transition duration-500 ease-in-out border-2 border-main ${
            step.selected || step.completed ? "bg-main text-white" : "bg-white "
          } h-12 w-12 flex items-center justify-center py-3`}
        >
          {index + 1}
        </motion.div>
        <div className='absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase'>{step.description}</div>
      </div>
      {index !== newStep.length - 1 && (
        <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed ? "border-main" : "border-gray-300"}`}></div>
      )}
    </div>
  ));

  return <section className='mx-4 p-4 flex justify-between items-center'>{displaySteps}</section>;
};
