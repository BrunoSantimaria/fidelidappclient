import { Box, Card, CardContent, Typography, Grid, Divider } from "@mui/material";
import { testimonials } from "../../data/testimonials";

export const Testimonials = () => {
  return (
    <Box sx={{ padding: 3, marginTop: "60px" }}>
      <Divider sx={{ width: { xs: "100vw", md: "80vw" }, margin: "0 auto", marginBottom: "60px" }} />
      <Typography
        variant='h3'
        sx={{ marginBottom: "60px", textAlign: "center", fontWeight: "bold", fontSize: { xs: 32, md: "3em" }, zIndex: 1, width: { xs: "100%", md: "100%" } }}
      >
        Lo que dicen nuestros clientes
      </Typography>
      <Grid container spacing={3} justifyContent='center' sx={{ width: "100vw" }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ marginRight: { xs: 3, md: 0, lg: 0 } }}>
            <Card sx={{ boxShadow: 6, borderRadius: 2, minHeight: { xs: "250px", md: "400px", lg: "280px" }, maxWidth: "450px" }}>
              <CardContent>
                <Box display='flex' alignItems='center' marginBottom={2}>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      marginRight: "16px",
                    }}
                  />
                  <div>
                    <Typography variant='h6' fontWeight='bold'>
                      {testimonial.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {testimonial.position}, {testimonial.industry}
                    </Typography>
                  </div>
                </Box>
                <Typography variant='body1' sx={{ fontStyle: "italic" }}>
                  "{testimonial.message}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
