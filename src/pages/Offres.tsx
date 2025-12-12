import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, TrendingUp, Leaf } from "lucide-react";

// Données statiques des offres prédéfinies AgriCapital
export const offresData = [
  {
    id: "palmelite",
    code_offre: "ELITE",
    nom_offre: "PalmElite",
    sous_titre: "Offre Intégrale Premium",
    cible: "Planteur propriétaire de terre agricole",
    droit_acces_normal: 30000,
    droit_acces_reduit: 20000,
    abonnement_jour: 65,
    abonnement_mois: 1900,
    abonnement_trimestre: 5500,
    abonnement_annuel: 20000,
    paiement_unique: false,
    avantages: ["100% propriétaire"],
    icon: Crown,
    couleur: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30"
  },
  {
    id: "palminvest",
    code_offre: "INVEST",
    nom_offre: "PalmInvest",
    sous_titre: "Investissement Sans Terre",
    cible: "Salarié public/privé, artisan, commerçant sans terre agricole",
    droit_acces_normal: 45000,
    droit_acces_reduit: 30000,
    abonnement_jour: 120,
    abonnement_mois: 3400,
    abonnement_trimestre: 9500,
    abonnement_annuel: 35400,
    paiement_unique: false,
    avantages: ["Diversification financière intéligente", "50% de la plantation à l'entrée en production"],
    icon: TrendingUp,
    couleur: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30"
  },
  {
    id: "terrapalm",
    code_offre: "TERRA",
    nom_offre: "TerraPalm",
    sous_titre: "Valorisation foncière sans effort",
    cible: "Propriétaire de terre agricole souhaitant pas exploiter lui-même",
    droit_acces_normal: 15000,
    droit_acces_reduit: 10000,
    abonnement_jour: 0,
    abonnement_mois: 0,
    abonnement_trimestre: 0,
    abonnement_annuel: 0,
    paiement_unique: true,
    avantages: ["Gestion complète assurée par AgriCapital et l'exploitant avant l'entrée en production", "50% de la plantation dès l'entrée en production"],
    icon: Leaf,
    couleur: "text-amber-700",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30"
  }
];

const Offres = () => {
  const [offres] = useState(offresData);
  const [offreActives, setOffreActives] = useState<{ [key: string]: boolean }>({
    palmelite: true,
    palminvest: true,
    terrapalm: true
  });

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant);
  };

  const toggleOffre = (id: string) => {
    setOffreActives(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Offres AgriCapital</h2>
          <p className="text-muted-foreground">Gérez les offres de souscription disponibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offres.map((offre) => {
          const IconComponent = offre.icon;
          const isActive = offreActives[offre.id];
          
          return (
            <Card 
              key={offre.id} 
              className={`relative overflow-hidden transition-all ${offre.border} ${!isActive ? 'opacity-60' : ''}`}
            >
              {/* Header avec icône */}
              <CardHeader className={`${offre.bg} pb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-white shadow-sm`}>
                      <IconComponent className={`h-8 w-8 ${offre.couleur}`} />
                    </div>
                    <div>
                      <CardTitle className={`text-xl ${offre.couleur}`}>
                        {offre.nom_offre}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{offre.sous_titre}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleOffre(offre.id)}
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Cible */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Pour qui ?</p>
                  <p className="text-sm">{offre.cible}</p>
                </div>

                {/* Droit d'accès */}
                <div>
                  <p className="text-sm text-muted-foreground">Droit d'accès :</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {formatMontant(offre.droit_acces_reduit)}F
                    </span>
                    <span className="text-sm">/ha</span>
                  </div>
                </div>

                {/* Abonnement ou Paiement unique */}
                {offre.paiement_unique ? (
                  <div>
                    <Badge variant="secondary" className="text-amber-700 bg-amber-100">
                      Paiement unique
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{offre.abonnement_jour}F</span>
                      <span className="text-sm text-muted-foreground">/ ha / jour</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>+ Abonnement modulable :</span>
                      </div>
                      <div className="pl-4 space-y-0.5">
                        <p>{formatMontant(offre.abonnement_mois)}F/mois</p>
                        <p>{formatMontant(offre.abonnement_trimestre)}F/trimestre</p>
                        <p>{formatMontant(offre.abonnement_annuel)}F/ha/an</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Avantages */}
                <div className="space-y-2 pt-2 border-t">
                  {offre.avantages.map((avantage, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{avantage}</span>
                    </div>
                  ))}
                </div>

                {/* Badge de statut */}
                <div className="pt-2">
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Offres;
