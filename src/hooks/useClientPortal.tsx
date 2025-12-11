import { useEffect, useState } from "react";

/**
 * Hook pour détecter si l'application est accédée via pay.agricapital.ci
 * et doit afficher le portail abonné plutôt que l'interface de gestion
 */
export const useClientPortal = () => {
  const [isClientPortal, setIsClientPortal] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    // Vérifier si c'est le sous-domaine pay ou client
    const isPayDomain = 
      hostname === 'pay.agricapital.ci' || 
      hostname === 'client.agricapital.ci' ||
      hostname.startsWith('pay.') ||
      hostname.startsWith('client.') ||
      // Pour le développement local
      window.location.pathname.startsWith('/pay') ||
      window.location.pathname.startsWith('/client');
    
    setIsClientPortal(isPayDomain);
  }, []);

  return { isClientPortal };
};

/**
 * Fonction utilitaire pour vérifier si on est sur le portail abonné
 */
export const isOnClientPortal = (): boolean => {
  const hostname = window.location.hostname;
  return (
    hostname === 'pay.agricapital.ci' || 
    hostname === 'client.agricapital.ci' ||
    hostname.startsWith('pay.') ||
    hostname.startsWith('client.') ||
    window.location.pathname.startsWith('/pay') ||
    window.location.pathname.startsWith('/client')
  );
};
