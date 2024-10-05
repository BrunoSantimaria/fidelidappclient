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
      <Typography
        variant='h4'
        sx={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: { xs: 28, md: 36 },
          marginBottom: 2,
        }}
      >
        Tu viaje hacia el éxito con Fidelidapp
      </Typography>
      <Typography sx={{ textAlign: "center", fontStyle: "italic", marginBottom: 4 }}>
        Un camino claro y sencillo que te lleva desde la implementación inicial hasta la fidelización efectiva de tus clientes.
      </Typography>

      <Grid
        container
        sx={{
          minHeight: "50vh",
          backgroundColor: "#f4f6f8",
          borderRadius: "12px",
          padding: 2,
          margin: { md: "0 auto" },
          marginTop: "40px",
        }}
      >
        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ padding: 2 }}>
          {sections.map((section) => (
            <Button
              key={section.id}
              fullWidth
              onClick={() => setSelectedSection(section)}
              sx={{
                display: "block",
                marginBottom: 2,
                backgroundColor: selectedSection.id === section.id ? "#e0f7fa" : "#ffffff",
                color: "#333",
                textTransform: "none",
                borderRadius: "8px",
                padding: "12px 16px",
                transition: "background-color 0.3s",
                ":hover": {
                  backgroundColor: "#e0f7fa",
                },
              }}
            >
              <Typography variant='body1' fontWeight={selectedSection.id === section.id ? "bold" : "normal"} sx={{ marginBottom: "4px" }}>
                {section.id}. {section.title}
              </Typography>
              <Typography variant='caption'>VER MÁS</Typography>
            </Button>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8} sx={{ padding: 2 }}>
          <Card
            sx={{
              boxShadow: 2,
              borderRadius: "12px",
              padding: 3,
            }}
          >
            <CardContent>
              <Typography variant='h5' fontWeight='bold' sx={{ marginBottom: 2 }}>
                {selectedSection.id}. {selectedSection.title}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 3 }}>
                {selectedSection.content}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={selectedSection.imgUrl}
                  alt={selectedSection.title}
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
