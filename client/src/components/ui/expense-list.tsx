import { useQuery } from "@tanstack/react-query";
import type { Expense } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { format } from "date-fns";
import { Skeleton } from "./skeleton";

function formatAmount(amount: string | number): string {
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0.00';
  }
}

interface ExpenseListProps {
  tourId?: number;
}

export function ExpenseList({ tourId }: ExpenseListProps) {
  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", { tourId }],
  });

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses?.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {format(new Date(expense.date), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="capitalize">{expense.category}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell className="text-right">
              ${formatAmount(expense.amount)}
            </TableCell>
          </TableRow>
        ))}
        {expenses?.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No expenses recorded yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}