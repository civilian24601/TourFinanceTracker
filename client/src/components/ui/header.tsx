import { Menu, Bell } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export function Header() {
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[#262629] backdrop-blur supports-[backdrop-filter]:bg-[#262629]/80">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-[#262629] p-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col"
            >
              <SheetHeader className="border-b border-border/40 px-6 py-4">
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex-1" />
              <div className="border-t border-border/40 p-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-primary"
                  onClick={() => {
                    logoutMutation.mutate();
                    setIsOpen(false);
                  }}
                >
                  Log out
                </Button>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6200] to-[#D2691E] bg-clip-text text-transparent">
            RoadBook
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
