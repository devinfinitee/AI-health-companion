import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex mb-4 gap-2"
            >
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </motion.div>

            <p className="mt-4 text-sm text-gray-600 mb-4">
              The page you're looking for doesn't exist.
            </p>

            <Button onClick={() => setLocation("/")} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
