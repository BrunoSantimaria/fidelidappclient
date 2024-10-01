import { Typography } from "@mui/material";

import { contactInfo } from "../../data/contactInfo";

export const ContactInfo = () => {
  console.log("hola");

  return (
    <>
      <Typography sx={{ fontSize: "24px", marginBottom: "10px" }}>{contactInfo.title}</Typography>
      {contactInfo.links.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <Typography className='transition-text' key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <IconComponent style={{ marginRight: "8px", height: "24px", width: "24px" }} />
            <a href={link.link} style={{ textDecoration: "none", color: "inherit" }}>
              {link.text}
            </a>
          </Typography>
        );
      })}
    </>
  );
};
