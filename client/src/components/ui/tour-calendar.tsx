import { useQuery } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import { type Tour } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { Calendar } from "lucide-react";

interface DayWithTour {
  date: Date;
  tour?: Tour;
}

export function TourCalendar() {
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  // Create an array of dates with tours
  const daysWithTours: DayWithTour[] = tours?.flatMap(tour => {
    const startDate = new Date(tour.startDate);
    const endDate = new Date(tour.endDate);
    const dates: DayWithTour[] = [];
    
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push({
        date: new Date(currentDate),
        tour: tour
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }) ?? [];

  // Create a modifier for days that have tours
  const tourDays = daysWithTours.map(day => day.date);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tour Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <DayPicker
            mode="multiple"
            selected={tourDays}
            modifiers={{
              tourDay: tourDays
            }}
            modifiersStyles={{
              tourDay: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))"
              }
            }}
          />
          <div className="space-y-4">
            <h3 className="font-medium">Upcoming Tours</h3>
            <div className="space-y-2">
              {tours?.filter(tour => new Date(tour.startDate) >= new Date()).map(tour => (
                <Link key={tour.id} href={`/tours/${tour.id}`}>
                  <a className="block p-3 rounded-md hover:bg-muted">
                    <div className="font-medium">{tour.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(tour.startDate), "MMM d")} - {format(new Date(tour.endDate), "MMM d, yyyy")}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
