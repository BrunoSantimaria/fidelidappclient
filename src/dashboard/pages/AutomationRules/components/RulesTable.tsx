import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { Rule } from '../AutomationRules';

interface RulesTableProps {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (rule: Rule) => void;
}

const RulesTable: React.FC<RulesTableProps> = ({ rules, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Condition</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Action Details</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule._id}>
            <TableCell>{rule.name}</TableCell>
            <TableCell>{rule.condition}</TableCell>
            <TableCell>{rule.conditionValue}</TableCell>
            <TableCell>
              <strong>Subject:</strong> {rule.subject} <br />
              <strong>Message:</strong>
              <div
                dangerouslySetInnerHTML={{ __html: rule.message }}
                style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '5px', borderRadius: '4px' }}
              />
            </TableCell>
            <TableCell>{rule.isActive ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(rule)}>Edit</Button>
              <Button color="error" onClick={() => onDelete(rule)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RulesTable;
