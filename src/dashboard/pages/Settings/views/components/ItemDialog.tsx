import React, { useState, useEffect } from "react";
import { Dialog, TextField, Box, Typography, Button, FormControlLabel, Switch } from "@mui/material";

interface ItemDialogProps {
  open: boolean;
  onClose: () => void;
  item?: {
    name: string;
    price: number;
    description?: string;
    available: boolean;
  } | null;
  onSave: (itemData: any) => void;
}

export const ItemDialog: React.FC<ItemDialogProps> = ({ open, onClose, item, onSave }) => {
  const [itemData, setItemData] = useState({
    name: "",
    price: 0,
    description: "",
    available: true,
  });

  useEffect(() => {
    if (item) {
      setItemData(item);
    } else {
      setItemData({
        name: "",
        price: 0,
        description: "",
        available: true,
      });
    }
  }, [item]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {item ? "Editar Item" : "Nuevo Item"}
        </Typography>

        <TextField fullWidth label='Nombre' value={itemData.name} onChange={(e) => setItemData({ ...itemData, name: e.target.value })} sx={{ mb: 2 }} />

        <TextField
          fullWidth
          type='number'
          label='Precio'
          value={itemData.price}
          onChange={(e) => setItemData({ ...itemData, price: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label='Descripción'
          value={itemData.description}
          onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={<Switch checked={itemData.available} onChange={(e) => setItemData({ ...itemData, available: e.target.checked })} />}
          label='Disponible'
          sx={{ mb: 2 }}
        />

        <Button fullWidth variant='contained' onClick={() => onSave(itemData)} sx={{ mt: 2 }}>
          Guardar Item
        </Button>
      </Box>
    </Dialog>
  );
};

export default ItemDialog;
