import { Box, Container, Paper, Typography, Grid, Divider } from "@mui/material";
import React from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

export const OurServices = () => {
  return (
    <Container sx={{ marginTop: "40px", justifyContent: "center", textAlign: "center", display: "flex", minWidth: "100vw" }}>
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: "40px", margin: "0 auto", justifyContent: "center", textAlign: "center" }}>
        <Typography variant='h3' sx={{ fontSize: { xs: 32, md: "3em" }, color: "black", position: "relative", zIndex: 1, width: { xs: "100%", md: "100%" } }}>
          Nuestros Servicios
        </Typography>
        <Grid container spacing={1} sx={{ marginTop: "20px", justifyContent: "center", gap: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Divider>
                <LocalOfferIcon sx={{ fontSize: 40, color: "#5b7898", marginBottom: "10px", margin: "0 auto" }} />
              </Divider>
              <Typography variant='h5' sx={{ marginTop: "20px" }}>
                Asesoría en Gestión de Fidelización
              </Typography>
              <Typography variant='body1' sx={{ marginTop: "10px" }}>
                Nuestro equipo trabaja contigo para diseñar estrategias de fidelización adaptadas a tus objetivos comerciales, que te ayudarán a aumentar la
                frecuencia de visitas, el ticket promedio, o la retención a largo plazo.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Divider>
                <PeopleIcon sx={{ fontSize: 40, color: "#5b7898", marginBottom: "10px", margin: "0 auto" }} />
              </Divider>
              <Typography variant='h5' sx={{ marginTop: "20px" }}>
                Fidelidapp – La Plataforma
              </Typography>
              <Typography variant='body1' sx={{ marginTop: "10px" }}>
                Nuestra herramienta intuitiva te permite gestionar promociones, recompensas y programas de lealtad de manera eficiente. Fidelidapp facilita cada
                paso, permitiéndote enfocarte en ofrecer un excelente servicio.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Divider>
                <BarChartIcon
                  sx={{
                    fontSize: 40,
                    color: "#5b7898",
                    marginBottom: "10px",
                    margin: "0 auto",
                  }}
                />
              </Divider>
              <Typography variant='h5' sx={{ marginTop: "20px" }}>
                Análisis y Segmentación de Clientes
              </Typography>
              <Typography variant='body1' sx={{ marginTop: "10px" }}>
                Analizamos y fortalecemos tu base de clientes a través de una segmentación de clientes. Con Fidelidapp, obtienes la información necesaria para
                tomar las mejores decisiones de fidelización.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
