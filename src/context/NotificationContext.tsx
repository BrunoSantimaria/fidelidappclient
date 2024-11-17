import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuthSlice } from "../hooks/useAuthSlice";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "LOAD_NOTIFICATIONS"; payload: Notification[] };

const NotificationContext = createContext<
  | {
      state: NotificationState;
      dispatch: React.Dispatch<NotificationAction>;
    }
  | undefined
>(undefined);

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => (notification.id === action.payload ? { ...notification, read: true } : notification)),
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    case "LOAD_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
};

export const NotificationProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });
  const { user } = useAuthSlice();

  useEffect(() => {
    if (user?.accounts?._id) {
      const loadNotifications = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${user.accounts._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          dispatch({
            type: "LOAD_NOTIFICATIONS",
            payload: data.map((notification) => ({
              id: notification._id,
              message: notification.message,
              type: notification.type,
              timestamp: new Date(notification.timestamp),
              read: notification.read,
            })),
          });
        } catch (error) {
          console.error("Error cargando notificaciones:", error);
        }
      };

      loadNotifications();
    }
  }, [user?.accounts?._id]);

  return <NotificationContext.Provider value={{ state, dispatch }}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
