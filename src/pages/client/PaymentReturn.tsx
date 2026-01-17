import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoWhite from "@/assets/logo-white.png";
import { CheckCircle, XCircle, Loader2, Home, RefreshCw } from "lucide-react";

interface PaymentReturnProps {
  onBack: () => void;
}

const PaymentReturn = ({ onBack }: PaymentReturnProps) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [paiement, setPaiement] = useState<any>(null);
  const [checkCount, setCheckCount] = useState(0);

  // Support multiple parameter formats from different payment providers
  const reference = searchParams.get('reference') || searchParams.get('ref');
  const urlStatus = searchParams.get('status');
  const transactionId = searchParams.get('id') || searchParams.get('transaction_id') || searchParams.get('transactionId');
  const paymentProvider = searchParams.get('provider') || 'auto';

  useEffect(() => {
    const checkPaymentStatus = async () => {
      console.log('PaymentReturn: Checking payment status', { reference, transactionId, urlStatus, paymentProvider });
      
      if (!reference && !transactionId) {
        console.log('PaymentReturn: No reference or transactionId found');
        setStatus('pending');
        return;
      }

      try {
        // 1. Rechercher le paiement en base
        let query = supabase.from('paiements').select(`
          *,
          plantations (nom_plantation, id_unique),
          souscripteurs (nom_complet, telephone)
        `);

        if (reference) {
          query = query.eq('reference', reference);
        } else if (transactionId) {
          query = query.eq('fedapay_transaction_id', transactionId);
        }

        const { data: dbPaiement, error: dbError } = await query.maybeSingle();
        
        if (dbError) {
          console.error('PaymentReturn: DB error', dbError);
          throw dbError;
        }

        console.log('PaymentReturn: Found payment', dbPaiement);

        if (dbPaiement) {
          setPaiement(dbPaiement);

          // Si déjà validé ou échoué, afficher le statut
          if (dbPaiement.statut === 'valide') {
            setStatus('success');
            return;
          }
          
          if (dbPaiement.statut === 'echec' || dbPaiement.statut === 'rejete') {
            setStatus('error');
            return;
          }

          // 2. Vérifier le statut côté serveur si on a un transactionId
          if (transactionId) {
            // Déterminer le provider depuis les metadata ou auto-detect
            const metadata = dbPaiement.metadata as Record<string, any> | null;
            const provider = metadata?.payment_provider || paymentProvider;
            
            let verifyResult = null;
            
            if (provider === 'kkiapay' || provider === 'auto') {
              // Essayer KKiaPay d'abord
              try {
                const { data, error } = await supabase.functions.invoke('kkiapay-verify-transaction', {
                  body: { transactionId }
                });
                
                if (!error && data?.success) {
                  verifyResult = {
                    provider: 'kkiapay',
                    status: data.transaction?.status?.toLowerCase(),
                    isSuccess: data.transaction?.isPaymentSuccessful,
                    amount: data.transaction?.amount
                  };
                }
              } catch (e) {
                console.log('PaymentReturn: KKiaPay verify failed, trying FedaPay', e);
              }
            }
            
            if (!verifyResult && (provider === 'fedapay' || provider === 'auto')) {
              // Essayer FedaPay
              try {
                const { data, error } = await supabase.functions.invoke('fedapay-verify-transaction', {
                  body: { transactionId }
                });
                
                if (!error && data?.success) {
                  const t = data.transaction;
                  const tStatus = (t?.status || t?.state || '').toString().toLowerCase();
                  verifyResult = {
                    provider: 'fedapay',
                    status: tStatus,
                    isSuccess: tStatus === 'approved',
                    amount: t?.amount
                  };
                }
              } catch (e) {
                console.log('PaymentReturn: FedaPay verify failed', e);
              }
            }
            
            console.log('PaymentReturn: Verify result', verifyResult);
            
            if (verifyResult) {
              const isApproved = verifyResult.isSuccess || verifyResult.status === 'success' || verifyResult.status === 'approved';
              const isFailed = verifyResult.status === 'failed' || verifyResult.status === 'declined' || 
                               verifyResult.status === 'canceled' || verifyResult.status === 'cancelled' || 
                               verifyResult.status === 'refused';
              
              if (isApproved || isFailed) {
                const newStatus = isApproved ? 'valide' : 'echec';
                
                const { error: updateError } = await supabase
                  .from('paiements')
                  .update({
                    statut: newStatus,
                    fedapay_transaction_id: transactionId,
                    montant_paye: isApproved ? (verifyResult.amount ?? dbPaiement.montant) : 0,
                    date_paiement: isApproved ? new Date().toISOString() : null,
                    metadata: {
                      ...(dbPaiement.metadata as Record<string, any> || {}),
                      verified_provider: verifyResult.provider,
                      verified_at: new Date().toISOString()
                    }
                  })
                  .eq('id', dbPaiement.id);

                if (!updateError) {
                  const updated = {
                    ...dbPaiement,
                    statut: newStatus,
                    fedapay_transaction_id: transactionId,
                    montant_paye: isApproved ? (verifyResult.amount ?? dbPaiement.montant) : 0,
                    date_paiement: isApproved ? new Date().toISOString() : null,
                  };
                  setPaiement(updated);
                  
                  // Si paiement DA validé, mettre à jour la superficie activée
                  if (isApproved && dbPaiement.type_paiement === 'DA' && dbPaiement.plantation_id) {
                    await updatePlantationAfterDA(dbPaiement);
                  }
                  
                  setStatus(isApproved ? 'success' : 'error');
                  return;
                }
              }
            }
          }
          
          // 3. Si le statut URL indique un succès, mettre à jour
          if (urlStatus === 'success' || urlStatus === 'approved') {
            const { error: updateError } = await supabase
              .from('paiements')
              .update({
                statut: 'valide',
                montant_paye: dbPaiement.montant,
                date_paiement: new Date().toISOString(),
              })
              .eq('id', dbPaiement.id);

            if (!updateError) {
              const updated = {
                ...dbPaiement,
                statut: 'valide',
                montant_paye: dbPaiement.montant,
                date_paiement: new Date().toISOString(),
              };
              setPaiement(updated);
              
              // Si paiement DA validé, mettre à jour la superficie activée
              if (dbPaiement.type_paiement === 'DA' && dbPaiement.plantation_id) {
                await updatePlantationAfterDA(dbPaiement);
              }
              
              setStatus('success');
              return;
            }
          }

          // Continuer à vérifier périodiquement
          if (checkCount < 10) {
            setTimeout(() => setCheckCount(c => c + 1), 2500);
          }
          setStatus('pending');
        } else {
          // Paiement non trouvé
          console.log('PaymentReturn: Payment not found in database');
          setStatus('pending');
        }
      } catch (error) {
        console.error('PaymentReturn: Error checking payment:', error);
        setStatus('pending');
      }
    };

    checkPaymentStatus();
  }, [reference, transactionId, checkCount, urlStatus, paymentProvider]);

  // Mettre à jour la plantation après paiement DA
  const updatePlantationAfterDA = async (paiement: any) => {
    try {
      // Récupérer la plantation
      const { data: plantation } = await supabase
        .from('plantations')
        .select('*')
        .eq('id', paiement.plantation_id)
        .single();
      
      if (plantation) {
        const newSuperficieActivee = plantation.superficie_ha;
        
        await supabase
          .from('plantations')
          .update({
            superficie_activee: newSuperficieActivee,
            date_activation: new Date().toISOString(),
            statut: 'active',
            statut_global: 'actif'
          })
          .eq('id', paiement.plantation_id);
          
        console.log('PaymentReturn: Plantation updated after DA payment');
      }
    } catch (error) {
      console.error('PaymentReturn: Error updating plantation after DA:', error);
    }
  };

  const formatMontant = (m: number) => {
    return new Intl.NumberFormat("fr-FR").format(m || 0) + " F CFA";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/85 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-center">
          <img 
            src={logoWhite} 
            alt="AgriCapital" 
            className="h-16 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            {status === 'loading' && (
              <>
                <Loader2 className="h-20 w-20 text-primary mx-auto animate-spin" />
                <h2 className="text-xl font-bold">Vérification du paiement...</h2>
                <p className="text-muted-foreground">Veuillez patienter</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative" />
                </div>
                <h2 className="text-2xl font-bold text-green-600">Paiement réussi !</h2>
                <p className="text-muted-foreground">
                  Votre paiement a été confirmé avec succès.
                </p>
                
                {paiement && (
                  <div className="bg-green-50 rounded-lg p-4 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Montant</span>
                      <span className="font-bold text-green-600">{formatMontant(paiement.montant_paye || paiement.montant)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{paiement.type_paiement === 'DA' ? "Droit d'Accès" : 'Redevance mensuelle'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Référence</span>
                      <span className="font-mono text-sm">{paiement.reference}</span>
                    </div>
                    {paiement.plantations && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plantation</span>
                        <span className="font-medium">{paiement.plantations.nom_plantation || paiement.plantations.id_unique}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button onClick={onBack} className="w-full h-12 gap-2">
                  <Home className="h-5 w-5" />
                  Retour à l'accueil
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Paiement échoué</h2>
                <p className="text-muted-foreground">
                  Votre paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support.
                </p>
                
                {paiement && (
                  <div className="bg-red-50 rounded-lg p-4 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Montant</span>
                      <span className="font-bold">{formatMontant(paiement.montant)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Référence</span>
                      <span className="font-mono text-sm">{paiement.reference}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button onClick={onBack} className="w-full h-12 gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Réessayer
                  </Button>
                  <Button variant="outline" onClick={onBack} className="w-full">
                    Retour à l'accueil
                  </Button>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <div className="relative">
                  <Loader2 className="h-20 w-20 text-amber-500 mx-auto animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-amber-600">Paiement en cours de traitement</h2>
                <p className="text-muted-foreground">
                  Votre paiement est en cours de vérification. Cela peut prendre quelques instants.
                </p>
                
                {checkCount < 5 && (
                  <p className="text-sm text-muted-foreground">
                    Vérification automatique... ({checkCount + 1}/5)
                  </p>
                )}

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCheckCount(c => c + 1)}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualiser le statut
                  </Button>
                  <Button onClick={onBack} className="w-full">
                    Retour à l'accueil
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white/90 text-sm">
        <p>Support: +225 05 64 55 17 17</p>
        <p className="text-xs text-white/70 mt-1">© 2025 AgriCapital</p>
      </footer>
    </div>
  );
};

export default PaymentReturn;
