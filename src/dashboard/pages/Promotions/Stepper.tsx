import { useState, useEffect } from "react";
import { StepperPromotion } from "./StepperPromotion";
import { StepperControl } from "./StepperControl";
import { PromotionDetails, PromotionInfo, PromotionRequirements, PromotionSystem } from "./components";
import api from "../../../utils/api";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

export const Stepper = () => {
  const { user } = useAuthSlice();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const { handleNavigate } = useNavigateTo();
  const [promotionDetails, setPromotionDetails] = useState({
    title: "",
    description: "",
    image: null,
    conditions: "",
  });
  const [promotionRequirements, setPromotionRequirements] = useState({
    visitsRequired: "",
    promotionDuration: "",
    rewards: [], // Usamos rewards para las recompensas
    isRecurrent: false,
    startDate: "",
    endDate: "",
    daysOfWeek: [],
  });

  const steps = ["Cómo crear una promoción", "Sistema de promoción", "Detalles de la promoción", "Requisitos de la promoción"];

  // Función para validar si un campo no está vacío
  const isFieldNotEmpty = (field: string | undefined) => field && field.trim() !== "";

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return true; // Primer paso no requiere validación
      case 2:
        return selectedSystem !== ""; // Validar que se haya seleccionado un sistema
      case 3:
        return isFieldNotEmpty(promotionDetails.title) && isFieldNotEmpty(promotionDetails.description) && promotionDetails.image !== null;
      case 4:
        if (selectedSystem === "visits") {
          // Validación de visitas necesarias y duración
          return isFieldNotEmpty(promotionRequirements.visitsRequired);
        } else if (selectedSystem === "points") {
          // Validación de que haya al menos una recompensa
          return promotionRequirements.rewards.length > 0;
        }
        return false; // No válido si no es ni "visits" ni "points"
      default:
        return false;
    }
  };

  // Restablecer los requisitos de la promoción cuando el sistema cambie
  useEffect(() => {
    setPromotionRequirements({
      visitsRequired: "",
      promotionDuration: "",
      rewards: [],
      isRecurrent: false,
      startDate: "",
      endDate: "",
      daysOfWeek: [],
    });
  }, [selectedSystem]);

  const displayStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PromotionInfo />;
      case 2:
        return <PromotionSystem setSelectedSystem={setSelectedSystem} selectedSystem={selectedSystem} />;
      case 3:
        return <PromotionDetails promotionDetails={promotionDetails} setPromotionDetails={setPromotionDetails} selectedSystem={selectedSystem} />;
      case 4:
        return (
          <PromotionRequirements system={selectedSystem} promotionRequirements={promotionRequirements} setPromotionRequirements={setPromotionRequirements} />
        );
      default:
        return null;
    }
  };

  const handleClick = (direction: string) => {
    if (direction === "next" && currentStep < steps.length) {
      if (validateStep()) {
        setCurrentStep(currentStep + 1);
      } else {
        toast.info("Por favor, completa todos los campos.");
      }
    } else if (direction === "previous" && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (direction === "next" && currentStep === steps.length) {
      if (validateStep()) {
        sendPromotionData();
      } else {
        toast.info("Los datos de la promoción no están completos.");
      }
    }
  };

  const sendPromotionData = async () => {
    const formData = new FormData();

    // Añadir todos los datos como campos de texto
    formData.append("email", user.email);
    formData.append("promotionDetails[title]", promotionDetails.title);
    formData.append("promotionDetails[description]", promotionDetails.description);
    formData.append("promotionDetails[conditions]", promotionDetails.conditions);
    formData.append("promotionRequirements[visitsRequired]", promotionRequirements.visitsRequired);
    formData.append("promotionRequirements[promotionDuration]", promotionRequirements.promotionDuration);
    formData.append("promotionRequirements[isRecurrent]", promotionRequirements.isRecurrent);
    

    // Si el selectedSystem es visits entonces sumar start y end date
    if (selectedSystem === "visits") {
      formData.append("promotionRequirements[startDate]", promotionRequirements.startDate);
      formData.append("promotionRequirements[endDate]", promotionRequirements.endDate);
      formData.append("promotionRequirements[daysOfWeek]", promotionRequirements.daysOfWeek); 
    }

    // Asegurarse de que `promotionRequirements.rewards` sea un array de objetos
    if (selectedSystem === "points") {
      if (promotionRequirements.rewards && Array.isArray(promotionRequirements.rewards) && promotionRequirements.rewards.length > 0) {
        // No convertir a JSON, dejar como un array de objetos
        promotionRequirements.rewards.forEach((reward, index) => {
          formData.append(`promotionRequirements[rewards][${index}][points]`, reward.points);
          formData.append(`promotionRequirements[rewards][${index}][description]`, reward.description);
        });
      } else {
        toast.error("Por favor, completa los premios.");
        return;
      }
    }

    formData.append("systemType", selectedSystem);

    // Añadir la imagen
    if (promotionDetails.image) {
      formData.append("image", promotionDetails.image);
    }

    // Verificación de campos completos
    if (
      !promotionDetails.title ||
      !promotionDetails.description ||
      !promotionDetails.conditions ||
      !promotionDetails.image ||
      (selectedSystem === "visits" && !promotionRequirements.visitsRequired)
    ) {
      console.log("Datos incompletos:", promotionDetails, promotionRequirements);

      toast.info("Por favor, completa todos los campos.");
      return;
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await api.post("/api/promotions/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Promoción creada con éxito:", response.data);
      toast.success("Promoción creada con éxito.");
      handleNavigate(`/dashboard/promotion/${response.data._id}`);
    } catch (error) {
      console.error("Error al crear la promoción:", error);
    }
  };

  const isNextDisabled = !validateStep();

  return (
    <div className='md:w-[90%] h-full border-t-4 border-1 border-black/20 border-t-[#5b7898] mx-auto shadow-xl p-0 md:p-6 rounded-2xl pb-2  mt-0 md:ml-24  xl:ml-32 md:mt-6 xl:mt-20 bg-white'>
      <div className='container horizontal mt-5'>
        <StepperPromotion steps={steps} currentStep={currentStep} />
      </div>
      <div className='mt-12 p-4'>{displayStepContent()}</div>
      <StepperControl
        handleClick={handleClick}
        currentStep={currentStep}
        steps={steps}
        isNextDisabled={isNextDisabled}
        handleSubmit={sendPromotionData} // Pasa la función `sendPromotionData`
      />
    </div>
  );
};
