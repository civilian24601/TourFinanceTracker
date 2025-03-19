import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Credit cards",
  "Banking",
  "Insurance",
  "Taxes",
  "Home",
  "Loans",
  "Travel",
  "Personal Finance",
  "Investing",
  "Small Business"
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-[#262629] z-50"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#363639]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex-1 transition-all duration-300",
                  isInputFocused ? "scale-[0.8] origin-left" : "scale-100"
                )}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Try 'Best savings account'?"
                      className="pl-10 bg-[#2d2d30] border-none"
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                    />
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-sm text-primary"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-xl font-semibold mb-4 text-white">Explore popular topics</h2>
              <div className="space-y-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className="flex items-center justify-between w-full p-2 text-left hover:bg-[#2d2d30] rounded-lg group"
                  >
                    <span className="text-[15px] text-white">{category}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}