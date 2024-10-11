import React, { useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Grid,
  CircularProgress,
  Backdrop,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useDashboard } from "../../hooks";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  title: yup.string("Ingresa el título de la promoción").min(5, "El título debe tener al menos 5 caracteres").required("El título es obligatorio"),
  description: yup.string("Ingresa lo que obtendrá el cliente").required("La descripción es obligatoria"),
  visitsRequired: yup
    .number("Ingresa la cantidad de compras requeridas")
    .min(0, "Las compras requeridas no pueden ser negativas")
    .required("Las compras requeridas son obligatorias"),
  promotionDuration: yup.number("Ingresa los días de validez").min(0, "La validez no puede ser negativa").required("La validez es obligatoria"),
  promotionType: yup.string("Selecciona el tipo de beneficio").required("El tipo de beneficio es obligatorio"),
  promotionRecurrent: yup.string("Selecciona si será recurrente").required("Elige si será recurrente o no"),
  conditions: yup.string("Ingresa las condiciones del programa").required("Las condiciones son obligatorias"),
  image: yup.mixed().required("La imagen es obligatoria"),
});

export const PromotionForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Para la redirección
  const { getPromotionsAndMetrics } = useDashboard();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      visitsRequired: 0,
      promotionDuration: 0,
      promotionType: "",
      promotionRecurrent: "",
      conditions: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("visitsRequired", values.visitsRequired);
      formData.append("promotionDuration", values.promotionDuration);
      formData.append("promotionType", values.promotionType);
      formData.append("promotionRecurrent", values.promotionRecurrent);
      formData.append("conditions", values.conditions);

      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        setLoading(true);
        await api.post("/api/promotions/create", formData);
        await getPromotionsAndMetrics();
        toast.success("Promoción creada con éxito");
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        toast.error("Error al crear la promoción");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id='title'
              name='title'
              label='Título de la promoción'
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id='description'
              name='description'
              label='¿Qué obtendrá el cliente?'
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              id='visitsRequired'
              name='visitsRequired'
              label='Compras requeridas'
              type='number'
              value={formik.values.visitsRequired}
              onChange={formik.handleChange}
              error={formik.touched.visitsRequired && Boolean(formik.errors.visitsRequired)}
              helperText={formik.touched.visitsRequired && formik.errors.visitsRequired}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              id='promotionDuration'
              name='promotionDuration'
              label='Validez (días)'
              type='number'
              value={formik.values.promotionDuration}
              onChange={formik.handleChange}
              error={formik.touched.promotionDuration && Boolean(formik.errors.promotionDuration)}
              helperText={formik.touched.promotionDuration && formik.errors.promotionDuration}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl component='fieldset' error={formik.touched.promotionType && Boolean(formik.errors.promotionType)}>
              <FormLabel component='legend'>Elige el tipo de beneficio</FormLabel>
              <RadioGroup aria-label='promotionType' name='promotionType' value={formik.values.promotionType} onChange={formik.handleChange}>
                <FormControlLabel value='Descuento' control={<Radio />} label='Descuento' />
                <FormControlLabel value='Regalo' control={<Radio />} label='Regalo' />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component='fieldset' error={formik.touched.promotionRecurrent && Boolean(formik.errors.promotionRecurrent)}>
              <FormLabel component='legend'>¿Será recurrente?</FormLabel>
              <RadioGroup aria-label='promotionRecurrent' name='promotionRecurrent' value={formik.values.promotionRecurrent} onChange={formik.handleChange}>
                <FormControlLabel value='True' control={<Radio />} label='Sí' />
                <FormControlLabel value='False' control={<Radio />} label='No' />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id='conditions'
              name='conditions'
              label='Condiciones del programa'
              multiline
              rows={3}
              value={formik.values.conditions}
              onChange={formik.handleChange}
              error={formik.touched.conditions && Boolean(formik.errors.conditions)}
              helperText={formik.touched.conditions && formik.errors.conditions}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant='contained' component='label' color={formik.touched.image && formik.errors.image ? "error" : "primary"}>
              Subir imagen
              <input type='file' name='image' accept='image/*' hidden onChange={(event) => formik.setFieldValue("image", event.target.files[0])} />
            </Button>
            {formik.values.image && <p>Imagen seleccionada: {formik.values.image.name}</p>}
            {formik.touched.image && formik.errors.image && <p style={{ color: "red" }}>{formik.errors.image}</p>}
          </Grid>

          <Grid item xs={12}>
            <Button color='primary' variant='contained' fullWidth type='submit' disabled={loading}>
              Enviar
            </Button>
          </Grid>
        </Grid>
      </form>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Box textAlign='center'>
          <CircularProgress color='inherit' />
          <Typography variant='h6' sx={{ mt: 2 }}>
            Generando promoción...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};
