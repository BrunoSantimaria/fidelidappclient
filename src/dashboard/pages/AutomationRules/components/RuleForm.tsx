import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Rule } from '../AutomationRules';

interface RuleFormProps {
  rule: Rule | null;
  onClose: () => void;
  onSave: (rule: Rule) => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, onClose, onSave }) => {
  const [form, setForm] = useState<Rule>(
    rule || { name: '', condition: '', conditionValue: '', subject: '', message: '', isActive: true }
  );

  const handleChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    setForm({ ...form, [e.target.name as string]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{rule ? 'Edit Rule' : 'Create Rule'}</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
        
        {/* Condition select with placeholder */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="condition-label">Condition</InputLabel>
          <Select
            labelId="condition-label"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            label="Condition"
          >
            <MenuItem value="" disabled>
              Choose a condition
            </MenuItem>
            <MenuItem value="clientInactivity">clientInactivity</MenuItem>
            <MenuItem value="promotionExpiration">promotionExpiration</MenuItem>
            <MenuItem value="clientRegistration">clientRegistration</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Condition Value" name="conditionValue" fullWidth value={form.conditionValue} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Asunto" name="subject" fullWidth value={form.subject} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Mensaje" name="message" fullWidth value={form.message} onChange={handleChange} sx={{ mb: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleForm;
