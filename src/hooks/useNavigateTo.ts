import { useNavigate } from "react-router-dom";

export const useNavigateTo = () => {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    navigate(to);
  };

  return {
    handleNavigate,
  };
};
