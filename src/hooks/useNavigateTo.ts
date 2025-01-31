import { useNavigate } from "react-router-dom";

export const useNavigateTo = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string, options = {}) => {
    navigate(path, options);
    window.scrollTo(0, 0);
  };

  return { handleNavigate };
};
