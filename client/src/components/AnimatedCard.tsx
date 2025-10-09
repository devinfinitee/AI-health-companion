import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardHover, fadeInUp } from "@/lib/animations";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  enableHover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  enableHover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={enableHover ? "hover" : undefined}
      variants={enableHover ? cardHover : fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}
