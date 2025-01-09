// create a div of a client attention chatbot
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaComment } from "react-icons/fa";

export interface ClientChatbotInteractionData {
    message: {
        remitent: string;
        content: string;
    };
    response: {
        reciever: string;
        content: string;
    };
}



