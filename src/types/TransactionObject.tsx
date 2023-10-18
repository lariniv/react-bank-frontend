export type TransactionsObject = {
  sum?: number;
  type?: "receive" | "send";
  address?: string;
  date?: Date;
  id: string;
};
