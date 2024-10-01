import { Typography } from "@mui/material";
import { ImportantLinksList } from "../../data/importantLinks";

export const ImportantLinks = () => {
  console.log(ImportantLinksList.title);
  return (
    <>
      <Typography sx={{ fontSize: "24px", marginBottom: "10px" }}>{ImportantLinksList.title}</Typography>
      {ImportantLinksList.elements.map(({ title, link }) => {
        return (
          <Typography className='transition-text' key={title} sx={{ marginBottom: "8px" }}>
            <a href={link} style={{ textDecoration: "none", color: "inherit" }}>
              {title}
            </a>
          </Typography>
        );
      })}
    </>
  );
};
