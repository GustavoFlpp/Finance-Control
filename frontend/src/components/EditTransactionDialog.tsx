// src/components/EditTransactionDialog.tsx
import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Transaction } from "../api/transactions";

interface Props {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (data: Partial<Transaction>) => void;
  loading: boolean;
}

const categoriesMap: Record<string, string> = {
  Uncategorized: "Sem categoria",
  Food: "Alimentação",
  Transport: "Transporte",
  Entertainment: "Entretenimento",
};

const categoryOptions = Object.entries(categoriesMap).map(([key, label]) => ({
  key,
  label,
}));

export default function EditTransactionDialog({
  open,
  transaction,
  onClose,
  onSave,
  loading,
}: Props) {
  const [formData, setFormData] = React.useState<Partial<Transaction>>({});

  React.useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name,
        value: transaction.value,
        category: transaction.category,
      });
    } else {
      setFormData({});
    }
  }, [transaction]);

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      alert("Nome não pode ficar vazio");
      return;
    }
    if (!formData.value || formData.value <= 0) {
      alert("Valor deve ser maior que zero");
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Transação</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Valor"
          type="number"
          fullWidth
          margin="normal"
          value={formData.value ?? ""}
          onChange={(e) => handleChange("value", Number(e.target.value))}
          disabled={loading}
          inputProps={{ step: "0.01", min: "0" }}
        />
        <TextField
          select
          label="Categoria"
          fullWidth
          margin="normal"
          value={formData.category || "Uncategorized"}
          onChange={(e) => handleChange("category", e.target.value)}
          disabled={loading}
        >
          {categoryOptions.map(({ key, label }) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
