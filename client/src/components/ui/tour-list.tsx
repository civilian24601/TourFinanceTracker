import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export function TourList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const deleteTour = useMutation({
    mutationFn: async (tourId: number) => {
      await apiRequest("DELETE", `/api/tours/${tourId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast({
        title: "Tour deleted",
        description: "The tour has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
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
          <TableHead className="w-[50px]"></TableHead>
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
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Tour</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this tour? This action cannot be undone.
                      All expenses associated with this tour will become unassigned.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteTour.mutate(tour.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
        {tours?.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No tours created yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}