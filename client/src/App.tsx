import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import PrintContract from "@/pages/PrintContract";
import { ContractProvider } from "@/lib/contract-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/print/contract" component={PrintContract} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContractProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ContractProvider>
    </QueryClientProvider>
  );
}

export default App;
