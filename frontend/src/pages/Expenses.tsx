// frontend/src/pages/Expenses.tsx

import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import Papa from "papaparse";

import TransactionList from "../components/TransactionList";
import EditTransactionDialog from "../components/EditTransactionDialog";
import { useTransactions } from "../hooks/useTransactions";

export default function Expenses() {
  const token = localStorage.getItem("token"); // pegando o token
  const { transactions, loading, error, reload, update, remove } =
    useTransactions(token || "");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTx, setEditTx] = useState<any>(null);

  function clearFile() {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadFile() {
    if (!file) return alert("Por favor, selecione um arquivo");

    setUploading(true);
    setUploadProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: async (row, parser) => {
        const data = row.data as any;

        // pegando os campos possíveis
        const name = data.name || data.Nome || data.description;
        const valueRaw = data.value || data.Valor || data.amount;
        const category = data.category || data.Categoria || "Outros";
        const dateRaw = data.date || data.Data;

        if (!name || !valueRaw) {
          console.warn("Linha inválida ignorada:", data);
          return;
        }

        const value = parseFloat(String(valueRaw).replace(",", "."));
        if (isNaN(value)) {
          console.warn("Valor inválido, linha ignorada:", data);
          return;
        }

        const date = dateRaw ? new Date(dateRaw) : new Date();

        try {
          await fetch("http://localhost:3000/api/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, value, category, date }),
          });
        } catch (err) {
          console.error("Erro ao enviar transação:", err);
        }
      },
      complete: async () => {
        setUploading(false);
        setUploadProgress(100);
        clearFile();
        await reload();
        alert("Upload finalizado!");
      },
    });
  }

  function handleEdit(tx: any) {
    setEditTx(tx);
    setEditOpen(true);
  }

  function handleCloseEdit() {
    setEditOpen(false);
    setEditTx(null);
  }

  async function handleSaveEdit(data: any) {
    if (!editTx) return;
    await update(editTx._id, data);
    handleCloseEdit();
  }

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finance Control - Despesas
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Tooltip title="Escolher arquivo CSV">
          <span>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{ minWidth: 0, padding: "6px 8px" }}
              disabled={uploading || loading}
            >
              <UploadFileIcon />
            </Button>
          </span>
        </Tooltip>

        {file && (
          <>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 250,
              }}
            >
              {file.name}
            </Typography>
            <IconButton
              size="small"
              onClick={clearFile}
              disabled={uploading || loading}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}

        <Button
          variant="contained"
          onClick={uploadFile}
          disabled={!file || uploading || loading}
        >
          {uploading ? <CircularProgress size={24} /> : "Enviar"}
        </Button>
      </Box>

      {(uploading || loading) && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={uploading ? uploadProgress : 100}
          />
        </Box>
      )}

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom>
        Transações
      </Typography>

      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={remove}
        loading={loading || uploading}
      />

      <EditTransactionDialog
        open={editOpen}
        transaction={editTx}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        loading={loading || uploading}
      />
    </Container>
  );
}
