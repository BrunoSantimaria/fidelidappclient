import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Custom hook para manejar el Snackbar
export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");

  const openSnackbar = (message: string, severity: "success" | "error" | "warning" | "info" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const SnackbarComponent = () => (
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );

  return {
    openSnackbar,
    closeSnackbar,
    SnackbarComponent,
  };
};
