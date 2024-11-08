import { ContactInfo } from "../interfaces/types";
import { IoLogoLinkedin, IoIosMail, IoLogoInstagram } from "react-icons/io";

export const contactInfo: ContactInfo = {
  title: "Información de contacto",
  links: [
    {
      text: "contacto@fidelidapp.cl",
      icon: IoIosMail,
      link: "mailto:contacto@fidelidapp.cl",
    },
    {
      text: "FidelidApp",
      icon: IoLogoLinkedin,
      link: "https://www.linkedin.com/company/fidelidappcl/posts/?feedView=all",
    },
    {
      text: "@fidelidApp",
      icon: IoLogoInstagram,
      link: "https://www.instagram.com/fidelidApp",
    },
  ],
};
