import { useQuery } from "@tanstack/react-query";
import type { Tour } from "@shared/schema";
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
import { Link } from "wouter";

export function TourList() {
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tours?.map((tour) => (
          <TableRow key={tour.id}>
            <TableCell>
              <Link href={`/tours/${tour.id}`}>
                <a className="hover:underline">{tour.name}</a>
              </Link>
            </TableCell>
            <TableCell>
              {format(new Date(tour.startDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(tour.endDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              ${Number(tour.budget).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
        {tours?.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No tours created yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
