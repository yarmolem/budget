import { EnumTransaccionMethod, EnumTransaccionType } from "@/interface";

export const transactionTypeOptions: {
  label: string;
  value: EnumTransaccionType;
}[] = [
  {
    label: "Expense",
    value: EnumTransaccionType.EXPENSE,
  },
  {
    label: "Income",
    value: EnumTransaccionType.INCOME,
  },
];

export const transactionMethodOptions: {
  label: string;
  value: EnumTransaccionMethod;
}[] = [
  {
    label: "Yape",
    value: EnumTransaccionMethod.YAPE,
  },
  {
    label: "Cash",
    value: EnumTransaccionMethod.CASH,
  },
  {
    label: "Bank transfer",
    value: EnumTransaccionMethod.TRANSFER,
  },
  {
    label: "Debit card",
    value: EnumTransaccionMethod.DEBIT_CARD,
  },
  {
    label: "Deposito",
    value: EnumTransaccionMethod.DEPOSIT,
  },
  {
    label: "Other",
    value: EnumTransaccionMethod.OTHER,
  },
];
