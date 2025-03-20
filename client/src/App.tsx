import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import HomePage from "@/pages/home-page";
import ExpensePage from "@/pages/expense-page";
import ToursPage from "@/pages/tours-page";
import TourDetailPage from "@/pages/tour-detail-page";
import ExpensesPage from "@/pages/expenses-page";
import InsightsPage from "@/pages/insights-page";
import LearnPage from "@/pages/learn-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location}>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/expense" component={ExpensePage} />
          <ProtectedRoute path="/tours" component={ToursPage} />
          <ProtectedRoute path="/tours/:id" component={TourDetailPage} />
          <ProtectedRoute path="/expenses" component={ExpensesPage} />
          <ProtectedRoute path="/insights" component={InsightsPage} />
          <ProtectedRoute path="/learn" component={LearnPage} />
          <Route path="/:rest*" component={NotFound} />
        </Switch>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;