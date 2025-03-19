import { motion } from "framer-motion";

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-8 bg-primary rounded-full"
          initial={{ scaleY: 0.5, opacity: 0.3 }}
          animate={{
            scaleY: [0.5, 1, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
