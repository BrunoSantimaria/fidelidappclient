import { motion, AnimatePresence } from "framer-motion";
import { generatePalette } from "@/promotion-client/utils/colorPalettes";
import { ChatBubble, Send, ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { default_responses } from "../default_responses";
import { ChatbotMessage } from "../interfacesChat";
import api from "@/utils/api";



export function ChatbotPage() {

  const client_data = {
    name: 'SebastiáN Valenzuela MartíNez',
    email: 'svalenzuela.martinez89@gmail.com',
    phoneNumber: '976543210',
    totalPoints: 0,
    activities: [],
    promotions: [],
    addedPromotions: [
      {
        promotion: [Object],
        addedDate: "2025-01-09T04:04:25.437Z",
        endDate: null,
        actualVisits: 0,
        pointsEarned: 0,
        status: 'Active',
        redeemCount: 0,
        visitDates: [],
        systemType: 'points',
        _id: '677f4ac9233a654863e8f501'
      }
    ]
  }


  const [loading, setLoading] = useState(true);
  const [isChatbotDialogOpen, setIsChatbotDialogOpen] = useState(false);
  const [chatbotMessage, setChatbotMessages] = useState<ChatbotMessage[]>([]);
  const [typeQuestions, setTypeQuestions] = useState<number[]>([]);
  const [enableInput, setEnableInput] = useState(true);
  const [isChatbotAtTop, setIsChatbotAtTop] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showOptions, setShowOptions] = useState(true);
  const [isResponding, setIsResponding] = useState(false);


  // Dentro del componente ChatbotPage
  const messageContainerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor de mensajes

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Llama al scroll cada vez que los mensajes cambien
  useEffect(() => {
    scrollToBottom();
  }, [chatbotMessage]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const keys = Object.keys(default_responses).map(Number);
      setIsChatbotDialogOpen(false);
      setEnableInput(true);
      setTypeQuestions([...keys]);
      if (!isChatbotDialogOpen) setChatbotMessages([]);
    };

    fetchQuestions();

    const updateChatbotPosition = () => {
      const viewportHeight = window.innerHeight;
      setIsChatbotAtTop(viewportHeight > 800);
    };

    updateChatbotPosition();
    window.addEventListener("resize", updateChatbotPosition);

    return () => {
      window.removeEventListener("resize", updateChatbotPosition);
    };
  }, []);

  const handleChatbotButton = () => {
    setIsChatbotDialogOpen(!isChatbotDialogOpen);
  }

  const addMessage = (message: string, name: string) => {
    setChatbotMessages((prevMessages) => [
      ...prevMessages,
      { name: name, message: message },
    ]);
  };

  const selectOption = async (questionIndex: number) => {
    if(isResponding) return; // Evita que se seleccione otra opción mientras el chatbot está respondiendo
    console.log("Seleccionando opción:", questionIndex);

    //setTypeQuestions((prevTypes: number[]) z prevTypes.filter((type) => type !== typeToRemove)  )
    //setIsVisibleBackQuestion(false);
    const question = default_responses[questionIndex].question;
    const response = default_responses[questionIndex].response;
    setIsResponding(true);
    // Muestra el mensaje del usuario
    addMessage(question, "Usuario");
    
    // Espera 1 segundo antes de agregar la respuesta del chatbot
    await delay(1000);
    addMessage(response, "Chatbot");
    await delay(500);
    
    setIsResponding(false);
    // Espera 500ms más antes de mostrar el botón
    //await delay(500);
    //setIsVisibleBackQuestion(true);
  };

  const fetchCustomResponse = async (message: string): Promise<string> => {
    try {
      // Petición al endpoint del chatbot
      const response = await api.post(`/api/chatbot`, {
        client_data: client_data, // Información adicional del cliente
        message: message,        // Mensaje enviado por el usuario
        info: {},                // Se envía un objeto vacío para evitar errores
      });

      // Verificar si la respuesta del servidor es válida
      if (response?.data?.response) {
        return response.data.response; // Accede correctamente a la respuesta
      } else {
        console.error("Respuesta inválida:", response.data);
        return "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.";
      }
    } catch (error) {
      console.error("Error en fetchCustomResponse:", error);
      return "Ocurrió un error al intentar conectarse con el servidor.";
    }
  };



  const sendMessage = async (message: string) => {
    if (!message) return; // Verificar que haya un mensaje válido
    addMessage(message, "Usuario"); // Mostrar el mensaje del usuario en el chat

    try {
      // Obtener respuesta personalizada del chatbot
      const response = await fetchCustomResponse(message);

      console.log("Respuesta personalizada recibida:", response);

      // Agregar la respuesta del chatbot al chat
      addMessage(response, "Chatbot");
    } catch (error) {
      console.error("Error en sendMessage:", error);

      // En caso de error, mostrar un mensaje genérico al usuario
      addMessage(
        "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo nuevamente más tarde.",
        "Chatbot"
      );
    }
  };

  const palette = generatePalette("miami-lights");

  return (
    <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto space-y-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div
            className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-white"
            role="status"
          >
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <AnimatePresence>
        {isChatbotDialogOpen && (
          <motion.div
            initial={{ opacity: 0, y: isChatbotAtTop ? -200 : 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isChatbotAtTop ? -200 : 200 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed ${isChatbotAtTop ? "top-2" : "bottom-2"} right-4 w-[90%] max-w-md sm:w-[30rem] sm:h-[30rem] ${palette.cardBackground} shadow-lg rounded-lg z-50`}
          >
            <div className={`flex items-center justify-between p-4 ${palette.background} rounded-t-lg`}>
              <h3 className={`text-lg font-bold ${palette.textPrimary}`}>Chatbot</h3>
              <button
                onClick={() => setShowOptions(!showOptions)} // Cambiar estado al hacer click
                className={`text-sm ${palette.textPrimary} ${palette.buttonHover} p-2 rounded-lg`}
              >
                {showOptions ? "Ocultar opciones" : "Mostrar opciones"}
                {!showOptions ? <ArrowDropUp className="ml-2" /> : <ArrowDropDown className="ml-2" />}
              </button>
            </div>

            {/* Contenedor flexible para las opciones */}
            <div className={`flex flex-col h-[calc(100%-64px)] ${palette.cardBackground} ${palette.textPrimary} p-2`}>
              {showOptions && (
                <div className="mb-4 flex flex-col space-y-2 overflow-y-auto max-h-[calc(100%-64px)]">
                  {typeQuestions.map((questionIndex, i) => {
                    const questionText = default_responses[questionIndex]?.question || "Pregunta no definida";
                    return (
                      <button
                        key={i}
                        onClick={() => selectOption(i)}
                        className={`w-full py-2 px-4 my-2 text-center ${palette.buttonBackground} ${palette.buttonHover} ${palette.textPrimary}`}
                      >
                        {questionText}
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Chatbot */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                {/* Mensajes del chatbot */}
                <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100%-64)]" ref={messageContainerRef}>
                  {chatbotMessage.map((message, i) => (
                    <div key={i} className={`p-4 ${palette.textPrimary}`}>
                      <p className="text-m font-bold">{message.name}</p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                {/* Contenedor para el campo de entrada */}
                <div className={`flex ${palette.background} p-4 rounded-b-lg`}>
                  {enableInput && (
                    <div className="flex w-full">
                      <input
                        type="text"
                        className={`flex-1 p-2 border border-gray-300 ${palette.textPrimary}`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") sendMessage(message);
                        }}
                        placeholder="Escribe tu mensaje..."
                      />
                      <button
                        onClick={() => { sendMessage(message) }}
                        className={`p-2 ${palette.textSecondary} ${palette.buttonHover} text-white rounded-full`}
                      >
                        <Send></Send>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>




      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, transform: "scale(0)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <button
            onClick={handleChatbotButton}
            className={`p-6 rounded-full ${palette.buttonBackground} ${palette.buttonHover}`}
          >
            <ChatBubble className={`${palette.textPrimary}`} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


/*

{/* Header del chatbot * /}
<div className={`flex items-center justify-between p-4 ${palette.background} rounded-t-lg`}>
<h3 className="text-lg font-bold">Chatbot</h3>
</div>

{/* Contenido del chatbot * /}
<div className={`flex-1 overflow-y-auto ${palette.cardBackground} ${palette.textPrimary} p-4 h-[calc(100%-64px)]`}>
{/* Aquí puedes agregar lógica para el chat * /}
<div>
  {/* Imagina que tienes una función que diga generateResponse, ahora quiero que este campo se autoinserte por cada respuesta * /}
  {chatbotMessage.map((message, index) => (
    <div key={index} className="mb-2">
      <p className="text-sm">{message}</p>
    </div>

  ))}
  <div className={`px-4 ${palette.textPrimary}`}>
    {/* Mensaje del cliente * /}
    <div className="mb-4">
      <p className="font-bold">Cliente:</p>
      <p className="pl-4">Hola, ¿puedes ayudarme con algo?</p>
    </div>
  </div>
  <div className={`px-4 ${palette.textPrimary}`}>
    {/* Respuesta del chatbot * /}
    <div className="mb-4">
      <p className="font-bold">Chatbot:</p>
      <p className="pl-4">¡Claro! ¿En qué necesitas ayuda?</p>
    </div>
  </div>


</div>
</div>

<div className={`flex ${palette.background} p-4 rounded-b-lg`}>
{/* padding del texto de input * /}

<input type="text" className="flex-1 p-2 border border-gray-300" />
<button className={`p-2 ${palette.buttonBackground} ${palette.buttonHover} text-white rounded-lg`}>Enviar</button>
</div>

*/

