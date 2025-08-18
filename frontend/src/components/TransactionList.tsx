//frontend/src/components/TransactionList.tsx

import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Transaction } from "../api/transactions";

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  loading,
}: Props) {
  return (
    <List>
      {transactions.map((tx) => (
        <ListItem
          key={tx._id}
          divider
          secondaryAction={
            <>
              <Tooltip title="Editar">
                <IconButton onClick={() => onEdit(tx)} disabled={loading}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton onClick={() => onDelete(tx._id)} disabled={loading}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          }
        >
          <ListItemText
            primary={`${tx.name} - ${tx.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`}
            secondary={`Categoria: ${tx.category}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
