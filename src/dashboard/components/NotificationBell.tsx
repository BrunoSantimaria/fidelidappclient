import React, { useState } from "react";
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, ListItemIcon } from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";

export const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { state, dispatch } = useNotifications();
  const { notifications } = state;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className='text-green-500' />;
      case "warning":
        return <WarningIcon className='text-yellow-500' />;
      case "error":
        return <ErrorIcon className='text-red-500' />;
      default:
        return <InfoIcon className='text-blue-500' />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} className='relative' sx={{ color: "white" }}>
        <Badge badgeContent={unreadCount} color='error' className='animate-pulse'>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className='mt-2'
      >
        <div className='w-96 max-h-[80vh] overflow-y-auto'>
          <div className='p-3 bg-main text-white flex justify-between items-center'>
            <Typography variant='h6'>Notificaciones</Typography>
            {notifications.length > 0 && (
              <button onClick={() => dispatch({ type: "CLEAR_ALL" })} className='text-sm hover:underline'>
                Limpiar todo
              </button>
            )}
          </div>

          <List>
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div key={notification.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <ListItem button onClick={() => handleMarkAsRead(notification.id)} className={`border-b ${!notification.read ? "bg-blue-50" : ""}`}>
                      <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary={
                          <div className='flex justify-between items-center'>
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                            {!notification.read && <span className='text-xs text-blue-500'>Nuevo</span>}
                          </div>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary='No hay notificaciones' className='text-center text-gray-500' />
                </ListItem>
              )}
            </AnimatePresence>
          </List>
        </div>
      </Popover>
    </>
  );
};
