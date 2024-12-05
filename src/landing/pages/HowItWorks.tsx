import { useRef, useState } from "react";
import { Box, Button, Grid, Typography, Card, CardContent, Container } from "@mui/material";
import { sections } from "../../data/sections";
import { ModalLanding } from "../components/ModalLanding";

export const HowItWorks = () => {
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [open, setOpen] = useState(false);
  const howItWorksRef = useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "60px",
        paddingX: 2,
      }}
      ref={howItWorksRef}
    >
      <Button
        variant='contained'
        sx={{
          margin: "0 auto",
          marginTop: "60px",
          width: { xs: "80vw", md: "50%" },
          minHeight: "50px",
          borderRadius: "8px",
        }}
        onClick={handleOpen}
      >
        Comienza tu viaje hoy
      </Button>
      <ModalLanding open={open} handleClose={handleClose} />
    </Container>
  );
};
