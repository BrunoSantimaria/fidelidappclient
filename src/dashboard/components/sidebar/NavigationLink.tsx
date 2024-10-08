import React from "react";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

interface Props {
  children: React.ReactNode;
  name: string;
  link: string;
}

export const NavigationLink = ({ children, name, link }: Props) => {
  const { handleNavigate } = useNavigateTo();
  return (
    <span
      onClick={() => handleNavigate(link)}
      className='flex p-2 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-white hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100'
    >
      {children}
      <div className='relative overflow-hidden w-full'>
        <p className={`${name.length > 18 ? "hover:marquee" : ""} text-inherit font-poppins whitespace-nowrap tracking-wide `}>{name}</p>
      </div>
    </span>
  );
};
