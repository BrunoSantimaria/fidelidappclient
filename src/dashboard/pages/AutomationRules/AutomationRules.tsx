import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import RulesTable from './components/RulesTable';
import RuleForm from './components/RuleForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

export interface Rule {
  _id?: string;
  name: string;
  condition: string;
  conditionValue: string;
  subject: string;
  message: string;
  isActive: boolean;
}

export const AutomationRulesPage = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // Fetch rules
  const fetchRules = async () => {
    try {
      const response = await api.get('/api/automation-rules');
      const data: Rule[] = await response.data;
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Handle create/edit
  const handleSaveRule = async (rule: Rule) => {
    try {
      let response;
      if (rule._id) {
        // Update existing rule
        response = await api.put(`/api/automation-rules/${rule._id}`, rule, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Create new rule
        response = await api.post('/api/automation-rules', rule, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      if (response) fetchRules();
      toast.success(`Regla ${rule._id ? 'actualizada' : 'creada'} correctamente`);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error(`Error al ${rule._id ? 'actualizar' : 'crear'} la regla`);
    }
    setSelectedRule(null);
  };
  

  // Handle delete
  const handleDeleteRule = async () => {
    if (!selectedRule?._id) return;
    try {
      await api.delete(`/api/automation-rules/${selectedRule._id}`, {
        method: 'DELETE',
      });
      toast.success('Regla eliminada correctamente');
      fetchRules();
    } catch (error) {
      toast.error('Error al eliminar la regla');
      console.error('Error deleting rule:', error);
    }
    setIsDeleteOpen(false);
    setSelectedRule(null);
  };

  return (
    <section className="flex flex-col md:p-10 ml-0 md:ml-20 lg:ml-20  gap-5">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Automation Rules
      </Typography>
      <Button variant="contained" onClick={() => setIsFormOpen(true)}>
        Create Rule
      </Button>
      <Box sx={{ mt: 3 }}>
        <RulesTable
          rules={rules}
          onEdit={(rule) => {
            setSelectedRule(rule);
            setIsFormOpen(true);
          }}
          onDelete={(rule) => {
            setSelectedRule(rule);
            setIsDeleteOpen(true);
          }}
        />
      </Box>
      {isFormOpen && (
        <RuleForm
          rule={selectedRule}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedRule(null);
          }}
          onSave={handleSaveRule}
        />
      )}
      {isDeleteOpen && (
        <DeleteConfirmation
          rule={selectedRule}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteRule}
        />
      )}
    </section>
  );
};
