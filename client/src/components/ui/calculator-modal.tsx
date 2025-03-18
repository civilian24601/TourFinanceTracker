import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { useState } from "react";
import { Calculator } from "lucide-react";

interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAmountSelect: (amount: number) => void;
}

export function CalculatorModal({ open, onOpenChange, onAmountSelect }: CalculatorModalProps) {
  const [display, setDisplay] = useState("0");
  
  const handleNumber = (num: string) => {
    setDisplay(prev => {
      if (prev === "0") return num;
      return prev + num;
    });
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(prev => prev + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleSubmit = () => {
    onAmountSelect(Number(display));
    onOpenChange(false);
    setDisplay("0");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculator
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="text-right text-2xl font-mono">${display}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumber(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button variant="outline" onClick={handleDecimal}>.</Button>
            <Button variant="outline" onClick={() => handleNumber("0")}>0</Button>
            <Button variant="outline" onClick={handleClear}>C</Button>
            <Button 
              className="col-span-3"
              onClick={handleSubmit}
            >
              Enter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
