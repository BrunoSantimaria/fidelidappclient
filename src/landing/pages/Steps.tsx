import { Container, Typography, Card, CardContent, useMediaQuery } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const benefits = [
  {
    time: "Construimos y fortalecemos tu base de clientes.",
    icon: <TrendingUpIcon />,
    description: "Ya sea que tengas una base de clientes o necesites crearla, te acompañamos a dar el siguiente paso.",
  },
  {
    time: "Identificamos segmentos en tus clientes.",
    icon: <PeopleIcon />,
    description: "Analizamos y descubrimos las tendencias de compra de tus clientes.",
  },
  {
    time: "Cuidamos la Satisfacción de Clientes.",
    icon: <EmojiEmotionsIcon />,
    description: "Entendemos lo que realmente le importa a tus clientes y generamos propuestas de valor para atenderlo.",
  },
];

export const Steps = () => {
  // Detectar si la pantalla es xs
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Container maxWidth='md' sx={{ textAlign: "center", py: 8 }}>
      <Typography variant='h4' align='center' color={"primary"} sx={{ mb: 6 }}>
        ¿Qué hacemos por tu negocio?
      </Typography>
      <Timeline position={isMobile ? "right" : "alternate"}>
        {benefits.map((benefit, index) => (
          <TimelineItem key={index}>
            {!isMobile && (
              <TimelineOppositeContent sx={{ m: "auto 0" }} align={index % 2 === 0 ? "right" : "left"} variant='h6' color='text.secondary'>
                {benefit.time}
              </TimelineOppositeContent>
            )}

            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color='primary'>{benefit.icon}</TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Card elevation={3} sx={{ py: 2, minWidth: 200 }}>
                <CardContent>
                  <Typography
                    variant='body1'
                    color='textSecondary'
                    sx={{
                      textAlign: isMobile ? "center" : index % 2 !== 0 ? "left" : "right",
                      fontSize: 16,
                    }}
                  >
                    {benefit.time}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      marginTop: 1,
                      textAlign: isMobile ? "center" : index % 2 !== 0 ? "left" : "right",
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
};
