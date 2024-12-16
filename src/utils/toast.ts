import { toast as baseToast, ToastOptions } from "react-toastify";

interface CustomToastOptions extends ToastOptions {
  icon?: React.ReactNode; // Propiedad opcional
}

const defaultOptions: CustomToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: "14px",
    fontWeight: 500,
  },
};

const toastConfig: Record<string, CustomToastOptions> = {
  success: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#f0fdf4",
      border: "1px solid #86efac",
      color: "#166534",
    },
  },
  error: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#991b1b",
    },
  },
  info: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#075985",
    },
  },
  warning: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#fffbeb",
      border: "1px solid #fde68a",
      color: "#92400e",
    },
  },
};

// Exportar como un objeto llamado `toast`
export const toast = {
  success: (message: string, options?: CustomToastOptions) => {
    return baseToast.success(message, { ...toastConfig.success, ...options });
  },
  error: (message: string, options?: CustomToastOptions) => {
    return baseToast.error(message, { ...toastConfig.error, ...options });
  },
  info: (message: string, options?: CustomToastOptions) => {
    return baseToast.info(message, { ...toastConfig.info, ...options });
  },
  warning: (message: string, options?: CustomToastOptions) => {
    return baseToast.warning(message, { ...toastConfig.warning, ...options });
  },
};
