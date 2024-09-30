import { ContactInfo } from "../interfaces/types";
import { IoLogoLinkedin, IoIosMail, IoLogoInstagram } from "react-icons/io";

export const contactInfo: ContactInfo = {
  title: "Información de contacto",
  links: [
    {
      text: "info@fidelidapp.com",
      icon: IoIosMail,
      link: "mailto:info@fidelidapp.com",
    },
    {
      text: "FidelidApp",
      icon: IoLogoLinkedin,
      link: "https://www.linkedin.com/in/fidelidapp",
    },
    {
      text: "@fidelidApp",
      icon: IoLogoInstagram,
      link: "https://www.instagram.com/fidelidApp",
    },
  ],
};
