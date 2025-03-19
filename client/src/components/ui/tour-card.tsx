import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Link } from "wouter";
import type { Tour } from "@shared/schema";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const today = new Date();
  const startDate = new Date(tour.startDate);
  const endDate = new Date(tour.endDate);

  const status = today < startDate 
    ? "upcoming"
    : today > endDate 
    ? "completed" 
    : "active";

  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-500",
    active: "bg-green-500/10 text-green-500",
    completed: "bg-yellow-500/10 text-yellow-500"
  };

  return (
    <Link href={`/tours/${tour.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        <Card className="w-[300px] h-[200px] hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-[#2d2d30] rounded-lg overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant="secondary" 
                className={statusColors[status]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-white hover:text-primary line-clamp-1">
              {tour.name}
            </h3>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>
                  {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{tour.venues?.length || 0} venues</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}