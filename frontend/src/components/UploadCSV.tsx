//frontend/src/components/UploadCSV.tsx

import React, { useState, useRef } from "react";
import {
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { uploadCSV } from "../api/transactions";

interface UploadCSVProps {
  onUploadSuccess: () => void;
}

export default function UploadCSV({ onUploadSuccess }: UploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearFile() {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return alert("Por favor, selecione um arquivo");
    setLoading(true);
    try {
      await uploadCSV(file, setUploadProgress);
      alert("Arquivo enviado com sucesso!");
      clearFile();
      onUploadSuccess();
    } catch {
      alert("Falha no envio do arquivo");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <Box display="flex" alignItems="center" gap={2} mb={3} position="relative">
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
          disabled={loading}
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
          <IconButton size="small" onClick={clearFile} disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )}
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? "Enviando..." : "Enviar"}
      </Button>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            bottom: -8,
            left: 0,
            width: "100%",
          }}
        >
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
    </Box>
  );
}
