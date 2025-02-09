import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import api from "../../../../utils/api";
import { toast } from "react-toastify";

const CampaignForm = ({ open, onClose, onCampaignCreated, totalCustomers }) => {
<<<<<<< Updated upstream
    const [form, setForm] = useState({ name: "", message: "", tag: "", contactSource: "" });
    const [error, setError] = useState("");
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await api.get("/api/clients/getDistinctTags");
            setTags(response.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
            toast.error("Error al obtener los tags");
        }
    };
=======
  const [form, setForm] = useState({ name: "", message: "" });
  const [error, setError] = useState("");
>>>>>>> Stashed changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< Updated upstream
    const handleSelectChange = (event) => {
        const value = event.target.value;
        if (value === "clients") {
            setForm((prev) => ({ ...prev, contactSource: value, tag: "" })); // Si selecciona "Todos los Clientes", limpiamos el tag
        } else {
            setForm((prev) => ({ ...prev, contactSource: "tag", tag: value })); // Seleccionar un tag específico
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedCount = form.contactSource === "clients" ?  totalCustomers : tags.find(tag => tag._id === form.tag).count

        const confirmMessage = `¿Estás seguro de que deseas crear esta campaña? Esto enviará un mensaje a ${selectedCount} clientes de tu lista de contactos.`;
        if (!window.confirm(confirmMessage)) {
            setError("No se ha enviado la campaña");
            return;
        }

        console.log("Creating campaign:", form);

        try {
            await api.post("/api/sms/campaign", {
                name: form.name,
                message: form.message,
                tag: form.tag,
                contactSource: form.contactSource,
            });

            setForm({ name: "", message: "", tag: "", contactSource: "" });
            setError("");
            onCampaignCreated();
            onClose();
            toast.success("Campaña creada correctamente");
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error("Error al crear la campaña");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Crear Campaña</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre de la Campaña"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    
                    {/* Selector de fuente de contactos */}
                    <FormControl fullWidth sx={{ mb: 2 }} required>
                        <InputLabel>Fuente de Contactos</InputLabel>
                        <Select value={form.tag || form.contactSource} onChange={handleSelectChange} label="Fuente de Contactos">
                            <MenuItem value="clients">Todos los Clientes</MenuItem>
                            {tags.map((tag, index) => (
                                <MenuItem key={index} value={tag._id}>
                                    {tag._id} ({tag.count})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Mensaje"
                        name="message"
                        fullWidth
                        multiline
                        rows={4}
                        value={form.message}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 150) {
                                setForm((prev) => ({ ...prev, message: value }));
                            }
                        }}
                        sx={{ mb: 2 }}
                        required
                        helperText={`${form.message.length}/150 caracteres`}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Set alert to confirm the creation of the campaign
    if (!window.confirm("Estás seguro de que deseas crear esta campana? Esto enviará un mensaje a " + totalCustomers + " clientes de tu lista de contactos.")) {
      setError("No se ha enviado la campaña");
      return;
    } else {
    }

    try {
      await api.post("/api/sms/campaign", { name: form.name, message: form.message });
      setForm({ name: "", message: "" });
      setError("");
      onCampaignCreated(); // Notify parent about new campaign creation
      onClose(); // Close the dialog
      toast.success("Campaña creada correctamente");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Error al crear la campaña");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Create Campaign</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField label='Nombre de la campaña' name='name' fullWidth value={form.name} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField
            label='Mensaje'
            name='message'
            fullWidth
            multiline
            rows={4}
            value={form.message}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 150) {
                setForm((prev) => ({ ...prev, message: value }));
              }
            }}
            sx={{ mb: 2 }}
            required
            helperText={`${form.message.length}/150 caracteres`} // Character counter
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
>>>>>>> Stashed changes
};

export default CampaignForm;
