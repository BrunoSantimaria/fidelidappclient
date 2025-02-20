import React from "react";
import { useNavigateTo } from "../../../hooks/useNavigateTo";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  children: React.ReactNode;
  name: string;
  link: string;
  isOpen?: boolean;
}

export const NavigationLink = ({ children, name, link, isOpen = false }: Props) => {
  const { handleNavigate } = useNavigateTo();

  const content = <div className='group-hover:stroke-neutral-100'>{children}</div>;

  return (
    <span
      onClick={() => handleNavigate(link)}
      className='group flex p-2 rounded cursor-pointer stroke-[0.75] stroke-neutral-400 text-white hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100'
    >
      {isOpen ? (
        content
      ) : (
        <Tooltip title={name} placement='right'>
          {content}
        </Tooltip>
      )}
      <div className='relative overflow-hidden w-full'>
        <p className={`${name.length > 18 ? "hover:marquee" : ""} text-inherit font-poppins whitespace-nowrap tracking-wide `}>{name}</p>
      </div>
    </span>
  );
};
