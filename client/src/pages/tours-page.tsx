import { Navigation } from "@/components/ui/navigation";
import { TourList } from "@/components/ui/tour-list";
import { TourForm } from "@/components/ui/tour-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ToursPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tours</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Tour
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tour</DialogTitle>
              </DialogHeader>
              <TourForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <TourList />
      </main>
    </div>
  );
}
