import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./lib/pages/Index";

// Configure QueryClient with global error handling


const App = () => (
  
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={ "/fn-discovery-tracker"}>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
 
);

export default App;
