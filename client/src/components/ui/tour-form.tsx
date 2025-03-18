import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTourSchema, type InsertTour } from "@shared/schema";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, CalendarClock, Check, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import * as z from 'zod';

export function TourForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<InsertTour & { description: string; location: string }>({
    resolver: zodResolver(insertTourSchema.extend({
      description: z.string().max(200, "Description must be less than 200 characters"),
      location: z.string().max(50, "Location must be less than 50 characters").optional(),
    })),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      budget: undefined,
      description: "",
      location: "",
    },
  });

  const createTour = useMutation({
    mutationFn: async (data: InsertTour & { description: string; location: string }) => {
      const res = await apiRequest("POST", "/api/tours", {
        ...data,
        budget: Number(data.budget),
        startDate: new Date(data.startDate as string).toISOString(),
        endDate: new Date(data.endDate as string).toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        form.reset();
        onSuccess?.();
      }, 2000);
      toast({
        title: "Tour created",
        description: "Your tour has been created successfully.",
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

  const setDuration = () => {
    const startDate = form.getValues("startDate");
    if (startDate) {
      const endDate = addDays(new Date(startDate), 7);
      form.setValue("endDate", format(endDate, "yyyy-MM-dd"));
    }
  };

  const nameLength = form.watch("name")?.length || 0;
  const descriptionLength = form.watch("description")?.length || 0;

  return (
    <div className="max-h-[80vh] overflow-y-auto px-6 py-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => createTour.mutate(data))}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Summer 2024 Tour" />
                    </FormControl>
                    <FormDescription className="text-right">
                      {nameLength}/50 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          value={value ? new Date(value).toISOString().split('T')[0] : ''}
                          onChange={(e) => onChange(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={setDuration}
                      >
                        <CalendarClock className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={value ? new Date(value).toISOString().split('T')[0] : ''}
                        onChange={(e) => onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="e.g., Austin, TX" />
                        <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Add tour details or locations"
                        className="resize-none"
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription className="text-right">
                      {descriptionLength}/200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-background pt-4 pb-2 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTour.isPending}
              className="min-w-[100px]"
            >
              {createTour.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Tour"
              )}
            </Button>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-background/80"
              >
                <div className="bg-green-500 text-white rounded-full p-4">
                  <Check className="h-8 w-8" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  );
}