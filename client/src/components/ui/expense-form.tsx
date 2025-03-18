import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema, type InsertExpense, categories, type Tour } from "@shared/schema";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Camera, Check, Plus } from "lucide-react";
import { createWorker } from "tesseract.js";
import { TagInput } from "./tag-input";
import { CalculatorModal } from "./calculator-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { TourForm } from "./tour-form";

// Predefined tags for common expense types
const commonTags = {
  travel: ["gas", "flight", "train", "taxi", "parking"],
  lodging: ["hotel", "airbnb", "hostel"],
  gear_purchase: ["instrument", "amplifier", "cables", "accessories"],
  gear_maintenance: ["repair", "tuning", "setup"],
  meals_per_diem: ["breakfast", "lunch", "dinner", "snacks"],
  merch_production: ["t-shirts", "vinyl", "cd", "posters"],
  merch_sales: ["shipping", "packaging", "online-fees"],
  marketing_promotion: ["ads", "social-media", "press"],
  crew_personnel: ["sound-tech", "roadie", "manager"],
  venue_booking: ["deposit", "rental", "insurance"],
  recording_studio: ["session", "mixing", "mastering"],
  miscellaneous: ["office", "software", "other"]
};

export function ExpenseForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tourDialogOpen, setTourDialogOpen] = useState(false);

  const { data: tours } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const form = useForm<InsertExpense>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      amount: undefined,
      category: "other",
      description: "",
      date: new Date().toISOString(),
      tourId: null,
      offlineId: undefined,
      tags: []
    },
  });

  const createExpense = useMutation({
    mutationFn: async (data: InsertExpense) => {
      const res = await apiRequest("POST", "/api/expenses", {
        ...data,
        amount: Number(data.amount),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        form.reset();
      }, 2000);
      toast({
        title: "Expense added",
        description: "Your expense has been recorded successfully.",
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

  const processReceipt = async (file: File) => {
    setIsProcessingImage(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Extract potential amount
      const amountMatch = text.match(/\$?\d+\.\d{2}/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[0].replace('$', ''));
        form.setValue('amount', amount);
      }

      // Set description
      form.setValue('description', text.split('\n')[0]); // First line as description

      // Suggest tags based on text content
      const suggestedTags = Object.entries(commonTags)
        .flatMap(([category, tags]) =>
          tags.filter(tag => text.toLowerCase().includes(tag.toLowerCase()))
        );

      if (suggestedTags.length > 0) {
        form.setValue('tags', suggestedTags);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "OCR Error",
        description: "Failed to process the receipt image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processReceipt(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createExpense.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="tourId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour (Optional)</FormLabel>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                  value={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tours?.map((tour) => (
                      <SelectItem key={tour.id} value={tour.id.toString()}>
                        {tour.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={tourDialogOpen} onOpenChange={setTourDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tour</DialogTitle>
                    </DialogHeader>
                    <TourForm onSuccess={() => setTourDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setCalculatorOpen(true)}
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.split('_').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="receipt-upload"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                    disabled={isProcessingImage}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  suggestions={commonTags[form.watch('category') as keyof typeof commonTags] || []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AnimatePresence>
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex justify-center items-center p-4"
            >
              <div className="bg-green-500 text-white rounded-full p-2">
                <Check className="h-6 w-6" />
              </div>
            </motion.div>
          ) : (
            <Button
              type="submit"
              className="w-full"
              disabled={createExpense.isPending || isProcessingImage}
            >
              {isProcessingImage ? "Processing Receipt..." : "Add Expense"}
            </Button>
          )}
        </AnimatePresence>
      </form>

      <CalculatorModal
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        onAmountSelect={(amount) => form.setValue('amount', amount)}
      />
    </Form>
  );
}