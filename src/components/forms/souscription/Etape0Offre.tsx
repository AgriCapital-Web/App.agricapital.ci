import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Crown, TrendingUp, Leaf, Check, Sparkles } from "lucide-react";
import { offresData } from "@/pages/Offres";
import { usePromotionActive, calculerMontantDA } from "@/hooks/usePromotionActive";

interface Etape0Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export const Etape0Offre = ({ formData, updateFormData }: Etape0Props) => {
  const { data: promotionActive } = usePromotionActive();
  
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant);
  };

  // Calculer le montant total du DA basé sur l'offre et la superficie
  const montantDA = useMemo(() => {
    if (!formData.offre_id || !formData.superficie_prevue) return null;
    
    const offre = offresData.find(o => o.id === formData.offre_id);
    if (!offre) return null;
    
    const tarifDA = promotionActive ? promotionActive.montant_reduit_ha : offre.droit_acces_reduit;
    const total = tarifDA * Number(formData.superficie_prevue);
    
    return {
      tarifUnitaire: tarifDA,
      total,
      superficie: Number(formData.superficie_prevue),
      promotionAppliquee: !!promotionActive
    };
  }, [formData.offre_id, formData.superficie_prevue, promotionActive]);

  const getIcone = (id: string) => {
    switch (id) {
      case 'palmelite': return Crown;
      case 'palminvest': return TrendingUp;
      case 'terrapalm': return Leaf;
      default: return Crown;
    }
  };

  return (
    <div className="space-y-6">
      {/* Promotion active */}
      {promotionActive && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
            <Sparkles className="h-5 w-5" />
            <span>🎉 Promotion en cours: {promotionActive.nom_promotion}</span>
          </div>
          <p className="text-sm text-amber-600">
            Droit d'accès réduit à {formatMontant(promotionActive.montant_reduit_ha)} F/ha 
            au lieu de {formatMontant(promotionActive.montant_normal_ha)} F/ha 
            (-{promotionActive.reduction_pct.toFixed(0)}%)
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Choisissez votre Offre</CardTitle>
          <CardDescription>Sélectionnez l'offre qui correspond au profil du partenaire abonné</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.offre_id}
            onValueChange={(value) => updateFormData({ offre_id: value })}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {offresData.map((offre) => {
              const IconComponent = getIcone(offre.id);
              const isSelected = formData.offre_id === offre.id;
              
              return (
                <div key={offre.id}>
                  <RadioGroupItem
                    value={offre.id}
                    id={offre.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={offre.id}
                    className={`flex flex-col h-full p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? `${offre.border} ${offre.bg} ring-2 ring-offset-2 ring-primary` 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full ${offre.bg}`}>
                        <IconComponent className={`h-6 w-6 ${offre.couleur}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold ${offre.couleur}`}>{offre.nom_offre}</h3>
                        <p className="text-xs text-muted-foreground">{offre.sous_titre}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {offre.cible}
                    </div>
                    
                    <div className="mt-auto space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold">{formatMontant(offre.droit_acces_reduit)}F</span>
                        <span className="text-xs text-muted-foreground">/ha</span>
                      </div>
                      
                      {!offre.paiement_unique && (
                        <div className="text-xs text-muted-foreground">
                          + {offre.abonnement_jour}F/jour/ha
                        </div>
                      )}
                      
                      {offre.paiement_unique && (
                        <Badge variant="secondary" className="text-amber-700 bg-amber-100 text-xs">
                          Paiement unique
                        </Badge>
                      )}
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium">
                        <Check className="h-4 w-4" /> Sélectionné
                      </div>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Superficie prévue */}
      <Card>
        <CardHeader>
          <CardTitle>Superficie prévue</CardTitle>
          <CardDescription>Indiquez la superficie approximative pour calculer le montant du Droit d'Accès</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="superficie_prevue">Superficie (hectares) *</Label>
            <Input
              id="superficie_prevue"
              type="number"
              step="0.5"
              min="1"
              max="100"
              value={formData.superficie_prevue || ""}
              onChange={(e) => updateFormData({ superficie_prevue: e.target.value })}
              placeholder="Ex: 5"
              required
            />
          </div>

          {/* Calcul du montant */}
          {montantDA && (
            <div className="p-4 bg-primary/10 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Superficie:</span>
                <span className="font-medium">{montantDA.superficie} ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tarif DA{montantDA.promotionAppliquee ? ' (promo)' : ''}:</span>
                <span className="font-medium">{formatMontant(montantDA.tarifUnitaire)} F/ha</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Montant Droit d'Accès:</span>
                <span className="text-lg font-bold text-primary">{formatMontant(montantDA.total)} F</span>
              </div>
              {montantDA.promotionAppliquee && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Sparkles className="h-3 w-3" />
                  <span>Promotion appliquée!</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé de l'offre sélectionnée */}
      {formData.offre_id && (
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de l'Offre</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const offre = offresData.find(o => o.id === formData.offre_id);
              if (!offre) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Offre:</span>
                      <p className="font-medium">{offre.nom_offre}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{offre.sous_titre}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Avantages inclus:</h4>
                    <ul className="space-y-1">
                      {offre.avantages.map((avantage, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{avantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};