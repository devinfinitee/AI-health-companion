import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Symptoms from "@/pages/Symptoms";
import BookAppointment from "@/pages/BookAppointment";
import AppointmentConfirmed from "@/pages/AppointmentConfirmed";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch location={location}>
        <Route path="/" component={Dashboard} />
        <Route path="/chat" component={Chat} />
        <Route path="/symptoms" component={Symptoms} />
        <Route path="/book-appointment" component={BookAppointment} />
        <Route path="/appointment-confirmed" component={AppointmentConfirmed} />
        <Route path="/appointments" component={AppointmentConfirmed} />
        <Route path="/resources" component={Resources} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
