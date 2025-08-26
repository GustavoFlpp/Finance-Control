import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const theme = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: color,
            color: "#fff",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default MetricCard;
