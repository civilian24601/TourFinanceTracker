import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";

const pageOrder = ["/", "/tours", "/expenses", "/insights", "/learn"];

export function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const currentIndex = pageOrder.indexOf(location);
    const lastLocation = sessionStorage.getItem("lastLocation");
    const lastIndex = lastLocation ? pageOrder.indexOf(lastLocation) : currentIndex;

    setDirection(currentIndex > lastIndex ? 1 : -1);
    sessionStorage.setItem("lastLocation", location);
  }, [location]);

  return (
    <motion.div
      initial={{ opacity: 0.5, x: 20 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0.5, x: -20 * direction }}
      transition={{ 
        duration: 0.15,
        ease: "easeInOut"
      }}
      style={{
        position: "relative",
        backgroundColor: "var(--background)",
        minHeight: "100vh"
      }}
    >
      {children}
    </motion.div>
  );
}