// src/pages/Dashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
} from "@mui/icons-material";
import { fetchTransactions } from "../api/transactions";
import { motion } from "framer-motion";
import { PieChart } from "@mui/x-charts/PieChart";
import MetricCard from "../components/MetricCard";

interface Transaction {
  _id: string;
  name: string;
  value: number;
  category: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // 2️⃣ Efeito para buscar dados da API
  // ----------------------------
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ----------------------------
  // 3️⃣ Processamento dos dados
  // ----------------------------
  const monthlyExpenses = useMemo(() => {
    const map: Record<
      string,
      { month: string; expenses: number; income: number }
    > = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("pt-BR", { month: "short" });
      if (!map[month]) map[month] = { month, expenses: 0, income: 0 };
      if (tx.value >= 0) map[month].income += tx.value;
      else map[month].expenses += Math.abs(tx.value);
    });
    return Object.values(map);
  }, [transactions]);

  const data = useMemo(() => {
    const total = transactions.reduce((acc, tx) => acc + tx.value, 0);

    const despesasTotais = transactions
      .filter((tx) => tx.value < 0)
      .reduce((acc, tx) => acc + Math.abs(tx.value), 0);

    const receitasTotais = transactions
      .filter((tx) => tx.value >= 0)
      .reduce((acc, tx) => acc + tx.value, 0);

    const expensesByCategory = transactions
      .filter((tx) => tx.value < 0)
      .reduce((acc, tx) => {
        const category = tx.category || "Outros";
        acc[category] = (acc[category] || 0) + Math.abs(tx.value);
        return acc;
      }, {} as Record<string, number>);

    const incomeByCategory = transactions
      .filter((tx) => tx.value >= 0)
      .reduce((acc, tx) => {
        const category = tx.category || "Outros";
        acc[category] = (acc[category] || 0) + tx.value;
        return acc;
      }, {} as Record<string, number>);

    return {
      saldoAtual: total,
      despesasTotais,
      receitasTotais,
      expensesByCategory: Object.entries(expensesByCategory).map(
        ([name, value], index) => ({ id: index, value, name })
      ),
      incomeByCategory: Object.entries(incomeByCategory).map(
        ([name, value], index) => ({ id: index, value, name })
      ),
    };
  }, [transactions]);

  const saldoProjetado = useMemo(() => {
    const monthlyIncome = monthlyExpenses.reduce((acc, m) => acc + m.income, 0);
    const monthlyExpense = monthlyExpenses.reduce(
      (acc, m) => acc + m.expenses,
      0
    );
    return data.saldoAtual + (monthlyIncome - monthlyExpense);
  }, [data.saldoAtual, monthlyExpenses]);

  // ----------------------------
  // 4️⃣ Insights AI-like
  // ----------------------------
  const insights = useMemo(() => {
    const categories = data.expensesByCategory.concat(data.incomeByCategory);
    if (monthlyExpenses.length < 2 || categories.length === 0) return [];

    const lastMonth = monthlyExpenses[monthlyExpenses.length - 2];
    const currentMonth = monthlyExpenses[monthlyExpenses.length - 1];
    const diffExpenses = currentMonth.expenses - lastMonth.expenses;
    const diffIncome = currentMonth.income - lastMonth.income;
    const totalExpenses = data.despesasTotais;

    const biggestCategory =
      categories.length > 0
        ? categories.reduce((prev, current) =>
            current.value > prev.value ? current : prev
          )
        : null;

    const formatNumber = (value: number) =>
      Number.isInteger(value)
        ? value.toLocaleString("pt-BR")
        : value.toFixed(1).replace(".", ",");

    const result: string[] = [];

    if (diffExpenses > 0)
      result.push(
        `🚨 Seus gastos subiram R$ ${diffExpenses.toLocaleString(
          "pt-BR"
        )} em relação ao mês anterior.`
      );
    else
      result.push(
        `✅ Você conseguiu reduzir as despesas em R$ ${Math.abs(
          diffExpenses
        ).toLocaleString("pt-BR")} em relação ao mês anterior.`
      );

    if (diffIncome > 0)
      result.push(
        `📈 Sua renda aumentou R$ ${diffIncome.toLocaleString(
          "pt-BR"
        )} no último mês.`
      );
    else
      result.push(
        `⚠️ Sua renda caiu R$ ${Math.abs(diffIncome).toLocaleString(
          "pt-BR"
        )} no último mês.`
      );

    if (biggestCategory && totalExpenses > 0) {
      result.push(
        `💡 Sua maior categoria de gastos é ${
          biggestCategory.name
        }, representando ${formatNumber(
          (biggestCategory.value / totalExpenses) * 100
        )}% do total.`
      );
    }

    if (data.saldoAtual < totalExpenses * 2) {
      result.push(
        `⚠️ Atenção: seu saldo atual cobre menos de 2 meses de despesas médias.`
      );
    } else {
      result.push(
        `✅ Bom sinal: seu saldo atual cobre mais de 2 meses de despesas médias.`
      );
    }

    return result;
  }, [data, monthlyExpenses]);

  // ----------------------------
  // 5️⃣ JSX retorna os gráficos e insights
  // ----------------------------
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        flexGrow: 1,
        // Adicionando o p: 3 aqui
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, color: "text.primary" }}
      >
        📊 Dashboard Financeiro
      </Typography>

      <Grid container spacing={3} justifyContent="space-between">
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Saldo Atual"
            value={data.saldoAtual}
            icon={<AccountBalanceWalletOutlined />}
            color="#4f46e5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Receitas Totais"
            value={data.receitasTotais}
            icon={<TrendingUpOutlined />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Despesas Totais"
            value={data.despesasTotais}
            icon={<TrendingDownOutlined />}
            color="#dc2626"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Saldo Projetado"
            value={saldoProjetado}
            icon={<AccountBalanceWalletOutlined />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }} justifyContent="space-between">
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Despesas por Categoria
            </Typography>
            <PieChart
              series={[
                {
                  data: data.expensesByCategory,
                  innerRadius: 80,
                  outerRadius: 100,
                  paddingAngle: 3,
                  cornerRadius: 5,
                },
              ]}
              height={450}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Receitas por Categoria
            </Typography>
            <PieChart
              series={[
                {
                  data: data.incomeByCategory,
                  innerRadius: 80,
                  outerRadius: 100,
                  paddingAngle: 3,
                  cornerRadius: 5,
                },
              ]}
              height={450}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              🔮 Insights Automáticos
            </Typography>
            <List>
              {insights.map((insight, idx) => (
                <ListItem key={idx} sx={{ p: 1 }}>
                  <Typography>{insight}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
