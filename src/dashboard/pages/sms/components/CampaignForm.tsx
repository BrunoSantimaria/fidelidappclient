import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import api from "../../../../utils/api";
import { toast } from "react-toastify";

const CampaignForm = ({ open, onClose, onCampaignCreated, totalCustomers }) => {
    const [form, setForm] = useState({ name: "", message: ""});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Campaign Name"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Message"
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
                        helperText={`${form.message.length}/150 characters`} // Character counter
                        
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
};

export default CampaignForm;
