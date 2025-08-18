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
  const [editTx, setEditTx] = useState(null);

  function clearFile() {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadFile() {
    if (!file) return alert("Por favor, selecione um arquivo");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    setUploading(true);
    setUploadProgress(0);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/api/upload");

      // Envia token no header Authorization
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      xhr.send(formData);
    })
      .then(() => {
        reload();
        alert("Arquivo enviado com sucesso!");
        clearFile();
      })
      .catch(() => {
        alert("Falha no envio do arquivo");
      })
      .finally(() => {
        setUploading(false);
        setUploadProgress(0);
      });
  }

  function handleEdit(tx) {
    setEditTx(tx);
    setEditOpen(true);
  }

  function handleCloseEdit() {
    setEditOpen(false);
    setEditTx(null);
  }

  async function handleSaveEdit(data) {
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
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            sx={{ minWidth: 0, padding: "6px 8px" }}
            disabled={uploading || loading}
          >
            <UploadFileIcon />
          </Button>
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
