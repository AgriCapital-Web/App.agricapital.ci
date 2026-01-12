import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Planteurs from "./pages/Souscriptions";
import PlanteurDetail from "./pages/PlanteurDetail";
import Plantations from "./pages/Plantations";
import GestionPaiements from "./pages/GestionPaiements";
import Utilisateurs from "./pages/Utilisateurs";
import RapportsFinanciers from "./pages/RapportsFinanciers";
import RapportsTechniques from "./pages/RapportsTechniques";
import Commissions from "./pages/Commissions";
import PortefeuilleClients from "./pages/PortefeuilleClients";
import Portefeuilles from "./pages/Portefeuilles";
import Equipes from "./pages/Equipes";
import Promotions from "./pages/Promotions";
import Offres from "./pages/Offres";
import NouvelleSouscription from "./pages/NouvelleSouscription";
import Parametres from "./pages/Parametres";
import HistoriqueComplet from "./pages/HistoriqueComplet";
import AccountRequest from "./pages/AccountRequest";
import AccountRequests from "./pages/AccountRequests";
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import Tickets from "./pages/Tickets";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant pour détecter le domaine et rediriger
const DomainRouter = () => {
  const [isClientDomain, setIsClientDomain] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Vérifier si c'est le sous-domaine pay uniquement
    const isPayDomain = 
      hostname === 'pay.agricapital.ci' || 
      hostname === 'client.agricapital.ci' ||
      hostname === 'abonne.agricapital.ci' ||
      hostname.startsWith('pay.') ||
      hostname.startsWith('client.') ||
      hostname.startsWith('abonne.');
    
    setIsClientDomain(isPayDomain);
  }, []);

  // Attendre la détection du domaine
  if (isClientDomain === null) {
    return null;
  }

  // Si c'est le domaine client (pay.agricapital.ci), afficher uniquement le portail souscripteur
  if (isClientDomain) {
    return (
      <Routes>
        <Route path="*" element={<ClientPortal />} />
      </Routes>
    );
  }

  // Sinon, afficher l'application de gestion normale (CRM) - SANS routes /pay, /client, /abonne
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account-request" element={<AccountRequest />} />
      <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
      
      {/* Protected routes - Dashboard & Core */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/account-requests" element={<AccountRequests />} />
      
      {/* Planteurs & Plantations */}
      <Route path="/souscriptions" element={<Planteurs />} />
      <Route path="/planteur/:id" element={<PlanteurDetail />} />
      <Route path="/planteur/:id/historique" element={<HistoriqueComplet />} />
      <Route path="/plantations" element={<Plantations />} />
      <Route path="/nouvelle-souscription" element={<NouvelleSouscription />} />
      
      {/* Paiements - nouvelle page unifiée */}
      <Route path="/paiements" element={<GestionPaiements />} />
      <Route path="/gestion-paiements" element={<GestionPaiements />} />
      
      {/* Équipes & Utilisateurs - redirigés vers Paramètres */}
      <Route path="/utilisateurs" element={<Navigate to="/parametres?tab=utilisateurs" replace />} />
      <Route path="/equipes" element={<Navigate to="/parametres?tab=equipes" replace />} />
      <Route path="/offres" element={<Navigate to="/parametres?tab=offres" replace />} />
      <Route path="/promotions" element={<Navigate to="/parametres?tab=promotions" replace />} />
      
      {/* Rapports */}
      <Route path="/rapports-financiers" element={<RapportsFinanciers />} />
      <Route path="/rapports-techniques" element={<RapportsTechniques />} />
      
      {/* Finances */}
      <Route path="/commissions" element={<Commissions />} />
      <Route path="/portefeuille-clients" element={<PortefeuilleClients />} />
      <Route path="/portefeuilles" element={<Portefeuilles />} />
      
      {/* Support */}
      <Route path="/tickets" element={<Tickets />} />
      
      {/* Admin - Paramètres contient tout */}
      <Route path="/parametres" element={<Parametres />} />
      
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DomainRouter />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
