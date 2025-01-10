import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import api from "../../../../utils/api";

const CampaignForm = ({ open, onClose, onCampaignCreated }) => {
    const [form, setForm] = useState({ name: "", message: "", phoneNumbers: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { phoneNumbers, ...rest } = form;
            const phoneNumbersArray = phoneNumbers.split(",").map((num) => num.trim());
            await api.post("/api/sms/campaign", { ...rest, phoneNumbers: phoneNumbersArray });
            setForm({ name: "", message: "", phoneNumbers: "" });
            onCampaignCreated(); // Notify parent about new campaign creation
            onClose(); // Close the dialog
        } catch (error) {
            console.error("Error creating campaign:", error);
            setError("Failed to create campaign");
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
                            if (value.length <= 160) {
                                setForm((prev) => ({ ...prev, message: value }));
                            }
                        }}
                        sx={{ mb: 2 }}
                        required
                        helperText={`${form.message.length}/160 characters`} // Character counter
                        
                    />
                    <TextField
                        label="Phone Numbers (comma-separated)"
                        name="phoneNumbers"
                        fullWidth
                        value={form.phoneNumbers}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CampaignForm;
