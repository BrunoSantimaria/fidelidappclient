import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Rule } from '../AutomationRules';

interface DeleteConfirmationProps {
  rule: Rule | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ rule, onClose, onConfirm }) => (
  <Dialog open onClose={onClose}>
    <DialogTitle>Delete Rule</DialogTitle>
    <DialogContent>
      Are you sure you want to delete the rule "{rule?.name}"?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmation;
