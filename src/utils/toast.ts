import { toast, ToastOptions } from "react-toastify";
import { ReactElement } from 'react';

interface CustomToastOptions extends ToastOptions {
  icon?: ReactElement;
}

const defaultOptions: CustomToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  icon: undefined,
  theme: "light",
  style: {
    borderRadius: "12px",
    padding: "16px",

    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: "14px",
    fontWeight: 500
  }
};

const toastConfig: Record<string, CustomToastOptions> = {
  success: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#f0fdf4",
      border: "1px solid #86efac",
      color: "#166534"
    },
    icon: <FiCheck className="w-5 h-5" />
  },
  error: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#991b1b"
    },
    icon: <FiAlertCircle className="w-5 h-5" />
  },
  info: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      color: "#075985"
    },
    icon: <FiInfo className="w-5 h-5" />
  },
  warning: {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#fffbeb",
      border: "1px solid #fde68a",
      color: "#92400e"
    },
    icon: <FiAlertTriangle className="w-5 h-5" />
  }
};

export const showToast = {
  success: (message: string, options?: CustomToastOptions) => {
    return toast.success(message, { ...toastConfig.success, ...options });
  },
  error: (message: string, options?: CustomToastOptions) => {
    return toast.error(message, { ...toastConfig.error, ...options });
  },
  info: (message: string, options?: CustomToastOptions) => {
    return toast.info(message, { ...toastConfig.info, ...options });
  },
  warning: (message: string, options?: CustomToastOptions) => {
    return toast.warning(message, { ...toastConfig.warning, ...options });
  }
};
