import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Stack } from "@mui/system";
import { planList } from "../../data/plans";
import { useState } from "react";
import { ModalLanding } from "../components/ModalLanding";

export const Plans = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ padding: 0, marginTop: "60px" }}>
      <Typography
        variant='h3'
        sx={{ marginBottom: "60px", fontWeight: "bold", fontSize: { xs: 32, md: "3em" }, textAlign: "center", width: { xs: "100%", md: "100%" } }}
      >
        Planes
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ marginLeft: { xs: 2, md: 0, lg: 0 } }} spacing={4} justifyContent='center'>
        {planList.map((plan, index) => (
          <Card
            key={index}
            sx={{
              width: { xs: 350, md: 450 },
              marginLeft: { xs: 12, md: 0, lg: 0 },
              padding: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              {/* Tipo de Plan */}
              <Typography variant='h5' fontWeight='bold' textAlign='center'>
                {plan.type}
              </Typography>

              <Typography variant='h6' color='text.secondary' textAlign='center'>
                ${plan.price}USD/MES
              </Typography>

              <List sx={{ flexGrow: 1 }}>
                {plan.description.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <LockOpenIcon color='primary' />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>

              {plan.button && (
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <Button variant='contained' color='primary' onClick={handleOpen}>
                    {plan.button}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
      <ModalLanding open={open} handleClose={handleClose} />
    </Box>
  );
};
