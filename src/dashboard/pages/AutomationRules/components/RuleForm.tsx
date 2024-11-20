import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{rule ? 'Edit Rule' : 'Create Rule'}</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Condition" name="condition" fullWidth value={form.condition} onChange={handleChange} sx={{ mb: 2 }} />
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
