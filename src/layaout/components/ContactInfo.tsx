import { Typography } from "@mui/material";
import { contactInfo } from "../../data/contactInfo";

export const ContactInfo = () => {
  return (
    <>
      <Typography sx={{ fontSize: "24px", marginBottom: "10px", color: "white" }}>{contactInfo.title}</Typography>
      {contactInfo.links.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <div className='flex items-center mb-2 group transition-colors   w-fit' key={index}>
            <IconComponent className='mr-2 h-6 w-6 text-white group-hover:text-gray-400 group-hover:duration-300' />
            <a href={link.link} className='text-white hover:none group-hover:text-gray-400  group-hover:duration-300'>
              {link.text}
            </a>
          </div>
        );
      })}
    </>
  );
};
