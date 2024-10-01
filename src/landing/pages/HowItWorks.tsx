import { useState } from "react";
import { Box, Button, Grid, Typography, Card, CardContent, Container } from "@mui/material";
import { sections } from "../../data/sections";
import { ModalLanding } from "../components/ModalLanding";

export const HowItWorks = () => {
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "60px" }}>
      <Typography
        variant='h3'
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { xs: 32, md: "3em" },

          width: { xs: "100%", md: "100%" },
        }}
      >
        Tu viaje hacia el éxito con Fidelidapp
      </Typography>
      <Typography sx={{ textAlign: "center", fontStyle: "italic" }}>
        Un camino claro y sencillo que te lleva desde la implementación inicial hasta la fidelización efectiva de tus clientes.
      </Typography>

      <Grid
        container
        sx={{
          minHeight: "50vh",
          backgroundColor: "#5C7B99",
          borderRadius: "15px",
          padding: 2,
          width: "70%",
          margin: { md: "0 auto" },
          marginTop: { xs: "60px", md: "60px" },
        }}
      >
        <Grid item xs={12} md={4} sx={{ backgroundColor: "#69849A", padding: 2, borderRadius: "15px 0 0 15px" }}>
          {sections.map((section) => (
            <Button
              key={section.id}
              fullWidth
              onClick={() => setSelectedSection(section)}
              sx={{
                display: "block",
                marginBottom: 2,
                backgroundColor: selectedSection.id === section.id ? "#E0E0E0" : "#F5F5F5",
                color: "#000",
                textTransform: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                ":hover": {
                  backgroundColor: "#D5D5D5",
                },
              }}
            >
              <Typography variant='body1' fontWeight={selectedSection.id === section.id ? "bold" : "normal"}>
                {section.id}. {section.title}
              </Typography>
              <Typography variant='caption'>VER MÁS</Typography>
            </Button>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8} sx={{ backgroundColor: "#F5F5F5", padding: 3, borderRadius: "0 15px 15px 0" }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant='h5' fontWeight='bold'>
                {selectedSection.id}. {selectedSection.title}
              </Typography>
              <Typography variant='body1' sx={{ marginTop: 2 }}>
                {selectedSection.content}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <img
                  src={selectedSection.imgUrl}
                  alt={selectedSection.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
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
          width: { xs: "80vw", md: "16vw" },
          minHeight: "80px",
          marginBottom: { xs: 2, md: 0 },
          marginTop: "40px",
        }}
        onClick={handleOpen}
      >
        Comienza tu viaje hoy.
      </Button>
      <ModalLanding open={open} handleClose={handleClose} />
    </div>
  );
};
