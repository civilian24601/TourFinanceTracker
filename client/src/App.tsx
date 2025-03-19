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
      <Switch key={location}>
        <Route path="/">
          <PageTransition>
            <ProtectedRoute path="/" component={HomePage} />
          </PageTransition>
        </Route>
        <Route path="/expense">
          <PageTransition>
            <ProtectedRoute path="/expense" component={ExpensePage} />
          </PageTransition>
        </Route>
        <Route path="/tours">
          <PageTransition>
            <ProtectedRoute path="/tours" component={ToursPage} />
          </PageTransition>
        </Route>
        <Route path="/tours/:id">
          <PageTransition>
            <ProtectedRoute path="/tours/:id" component={TourDetailPage} />
          </PageTransition>
        </Route>
        <Route path="/expenses">
          <PageTransition>
            <ProtectedRoute path="/expenses" component={ExpensesPage} />
          </PageTransition>
        </Route>
        <Route path="/insights">
          <PageTransition>
            <ProtectedRoute path="/insights" component={InsightsPage} />
          </PageTransition>
        </Route>
        <Route path="/learn">
          <PageTransition>
            <ProtectedRoute path="/learn" component={LearnPage} />
          </PageTransition>
        </Route>
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
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