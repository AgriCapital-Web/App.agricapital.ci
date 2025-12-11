import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, CheckCircle, Crown, TrendingUp, MapPin, Info } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import offrePalmElite from "@/assets/offre-palmelite.png";
import offrePalmInvest from "@/assets/offre-palminvest.png";
import offtrTerraPalm from "@/assets/offre-terrapalm.png";

// Types d'offres prédéfinies
const OFFRES_TYPES = [
  {
    id: 'palm_elite',
    nom: 'PalmElite',
    sous_titre: 'Offre Intégrale Premium',
    image: offrePalmElite,
    cible: 'Planteur propriétaires de terre agricole',
    droit_acces_normal: 30000,
    droit_acces_reduit: 20000,
    abonnement_jour: 65,
    abonnement_mois: 1900,
    abonnement_trimestre: 5500,
    abonnement_annee: 20000,
    avantages: ['100% propriétaire'],
    couleur: 'green',
    icon: Crown
  },
  {
    id: 'palm_invest',
    nom: 'PalmInvest',
    sous_titre: 'Investissement Sans Terre',
    image: offrePalmInvest,
    cible: 'Salarié publique/privé, artisant, commerçant sans terre agricole',
    droit_acces_normal: 45000,
    droit_acces_reduit: 30000,
    abonnement_jour: 120,
    abonnement_mois: 3400,
    abonnement_trimestre: 9500,
    abonnement_annee: 35400,
    avantages: ['Diversification financière intéligente', '50% de la plantation à l\'entrée en production'],
    couleur: 'blue',
    icon: TrendingUp
  },
  {
    id: 'terra_palm',
    nom: 'TerraPalm',
    sous_titre: 'Valorisation foncière sans effort',
    image: offtrTerraPalm,
    cible: 'Propriétaire de terre agricole souhaitant pas exploiter lui-même',
    droit_acces_normal: 15000,
    droit_acces_reduit: 10000,
    abonnement_jour: 0,
    abonnement_mois: 0,
    abonnement_trimestre: 0,
    abonnement_annee: 0,
    paiement_unique: true,
    avantages: ['Gestion complète assurée par AgriCapital et l\'exploitant avant l\'entrée en production', '50% de la plantation dès l\'entrée en production'],
    couleur: 'orange',
    icon: MapPin
  }
];

interface Offre {
  id: string;
  code_offre: string;
  nom_offre: string;
  sous_titre: string;
  cible: string;
  droit_acces_normal: number;
  droit_acces_reduit: number;
  abonnement_jour: number;
  abonnement_mois: number;
  abonnement_trimestre: number;
  abonnement_annee: number;
  paiement_unique: boolean;
  avantages: string[];
  description: string | null;
  actif: boolean;
  created_at: string;
}

const Offres = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState<Offre | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  const [formData, setFormData] = useState({
    code_offre: "",
    nom_offre: "",
    sous_titre: "",
    cible: "",
    droit_acces_normal: "30000",
    droit_acces_reduit: "20000",
    abonnement_jour: "65",
    abonnement_mois: "1900",
    abonnement_trimestre: "5500",
    abonnement_annee: "20000",
    paiement_unique: false,
    avantages: "",
    description: "",
    actif: true,
  });

  // Fetch offres
  const { data: offres, isLoading } = useQuery({
    queryKey: ['offres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offres')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.log("Table offres doesn't exist yet:", error.message);
        return [];
      }
      return data as Offre[];
    }
  });

  // Appliquer le type prédéfini
  const handleTypeSelect = (typeId: string) => {
    const offreType = OFFRES_TYPES.find(t => t.id === typeId);
    if (offreType) {
      setSelectedType(typeId);
      setFormData({
        code_offre: offreType.id,
        nom_offre: offreType.nom,
        sous_titre: offreType.sous_titre,
        cible: offreType.cible,
        droit_acces_normal: offreType.droit_acces_normal.toString(),
        droit_acces_reduit: offreType.droit_acces_reduit.toString(),
        abonnement_jour: offreType.abonnement_jour.toString(),
        abonnement_mois: offreType.abonnement_mois.toString(),
        abonnement_trimestre: offreType.abonnement_trimestre.toString(),
        abonnement_annee: offreType.abonnement_annee.toString(),
        paiement_unique: offreType.paiement_unique || false,
        avantages: offreType.avantages.join('\n'),
        description: "",
        actif: true,
      });
    }
  };

  // Create/Update offre
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const offreData = {
        code_offre: data.code_offre,
        nom_offre: data.nom_offre,
        sous_titre: data.sous_titre,
        cible: data.cible,
        droit_acces_normal: parseInt(data.droit_acces_normal),
        droit_acces_reduit: parseInt(data.droit_acces_reduit),
        abonnement_jour: parseInt(data.abonnement_jour),
        abonnement_mois: parseInt(data.abonnement_mois),
        abonnement_trimestre: parseInt(data.abonnement_trimestre),
        abonnement_annee: parseInt(data.abonnement_annee),
        paiement_unique: data.paiement_unique,
        avantages: data.avantages.split('\n').filter(a => a.trim()),
        description: data.description,
        actif: data.actif,
      };

      if (editingOffre) {
        const { error } = await supabase
          .from('offres')
          .update(offreData)
          .eq('id', editingOffre.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('offres')
          .insert([offreData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offres'] });
      toast({
        title: "Succès",
        description: editingOffre ? "Offre modifiée" : "Offre créée",
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  });

  // Toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, actif }: { id: string; actif: boolean }) => {
      const { error } = await supabase
        .from('offres')
        .update({ actif })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offres'] });
      toast({
        title: "Succès",
        description: "Statut modifié",
      });
    }
  });

  // Delete offre
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('offres')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offres'] });
      toast({
        title: "Succès",
        description: "Offre supprimée",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      code_offre: "",
      nom_offre: "",
      sous_titre: "",
      cible: "",
      droit_acces_normal: "30000",
      droit_acces_reduit: "20000",
      abonnement_jour: "65",
      abonnement_mois: "1900",
      abonnement_trimestre: "5500",
      abonnement_annee: "20000",
      paiement_unique: false,
      avantages: "",
      description: "",
      actif: true,
    });
    setEditingOffre(null);
    setSelectedType('');
  };

  const handleEdit = (offre: Offre) => {
    setEditingOffre(offre);
    setFormData({
      code_offre: offre.code_offre,
      nom_offre: offre.nom_offre,
      sous_titre: offre.sous_titre,
      cible: offre.cible,
      droit_acces_normal: offre.droit_acces_normal.toString(),
      droit_acces_reduit: offre.droit_acces_reduit.toString(),
      abonnement_jour: offre.abonnement_jour.toString(),
      abonnement_mois: offre.abonnement_mois.toString(),
      abonnement_trimestre: offre.abonnement_trimestre.toString(),
      abonnement_annee: offre.abonnement_annee.toString(),
      paiement_unique: offre.paiement_unique,
      avantages: offre.avantages?.join('\n') || "",
      description: offre.description || "",
      actif: offre.actif,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const formatMontant = (m: number) => {
    return new Intl.NumberFormat("fr-FR").format(m) + " F";
  };

  return (
    <MainLayout title="Gestion des Offres">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Offres</h1>
            <p className="text-muted-foreground">Configuration des offres PalmElite, PalmInvest et TerraPalm</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Offre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingOffre ? "Modifier l'offre" : "Créer une offre"}
                </DialogTitle>
                <DialogDescription>
                  Configurez les tarifs et les conditions de l'offre
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sélection du type prédéfini */}
                {!editingOffre && (
                  <div className="space-y-2">
                    <Label>Type d'offre prédéfini</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {OFFRES_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div 
                            key={type.id}
                            onClick={() => handleTypeSelect(type.id)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                              selectedType === type.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-2 ${
                              type.couleur === 'green' ? 'text-green-600' :
                              type.couleur === 'blue' ? 'text-blue-600' : 'text-orange-600'
                            }`} />
                            <p className="font-semibold text-sm">{type.nom}</p>
                            <p className="text-xs text-muted-foreground">{type.sous_titre}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code offre *</Label>
                    <Input
                      id="code"
                      value={formData.code_offre}
                      onChange={(e) => setFormData({...formData, code_offre: e.target.value})}
                      placeholder="palm_elite"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom de l'offre *</Label>
                    <Input
                      id="nom"
                      value={formData.nom_offre}
                      onChange={(e) => setFormData({...formData, nom_offre: e.target.value})}
                      placeholder="PalmElite"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soustitre">Sous-titre</Label>
                    <Input
                      id="soustitre"
                      value={formData.sous_titre}
                      onChange={(e) => setFormData({...formData, sous_titre: e.target.value})}
                      placeholder="Offre Intégrale Premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cible">Cible</Label>
                    <Input
                      id="cible"
                      value={formData.cible}
                      onChange={(e) => setFormData({...formData, cible: e.target.value})}
                      placeholder="Planteur propriétaires de terre agricole"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Tarification Droit d'Accès
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="da_normal">Montant normal (F/ha)</Label>
                      <Input
                        id="da_normal"
                        type="number"
                        value={formData.droit_acces_normal}
                        onChange={(e) => setFormData({...formData, droit_acces_normal: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="da_reduit">Montant réduit (F/ha)</Label>
                      <Input
                        id="da_reduit"
                        type="number"
                        value={formData.droit_acces_reduit}
                        onChange={(e) => setFormData({...formData, droit_acces_reduit: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Abonnement modulable</h4>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.paiement_unique}
                        onCheckedChange={(checked) => setFormData({...formData, paiement_unique: checked})}
                      />
                      <Label className="text-sm">Paiement unique (pas d'abonnement)</Label>
                    </div>
                  </div>
                  
                  {!formData.paiement_unique && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ab_jour">F/ha/jour</Label>
                        <Input
                          id="ab_jour"
                          type="number"
                          value={formData.abonnement_jour}
                          onChange={(e) => setFormData({...formData, abonnement_jour: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ab_mois">F/ha/mois</Label>
                        <Input
                          id="ab_mois"
                          type="number"
                          value={formData.abonnement_mois}
                          onChange={(e) => setFormData({...formData, abonnement_mois: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ab_trim">F/ha/trimestre</Label>
                        <Input
                          id="ab_trim"
                          type="number"
                          value={formData.abonnement_trimestre}
                          onChange={(e) => setFormData({...formData, abonnement_trimestre: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ab_an">F/ha/an</Label>
                        <Input
                          id="ab_an"
                          type="number"
                          value={formData.abonnement_annee}
                          onChange={(e) => setFormData({...formData, abonnement_annee: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avantages">Avantages (un par ligne)</Label>
                  <Textarea
                    id="avantages"
                    value={formData.avantages}
                    onChange={(e) => setFormData({...formData, avantages: e.target.value})}
                    placeholder="100% propriétaire&#10;Gestion complète assurée"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Informations complémentaires..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="actif"
                    checked={formData.actif}
                    onCheckedChange={(checked) => setFormData({...formData, actif: !!checked})}
                  />
                  <Label htmlFor="actif">Offre active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cartes des offres prédéfinies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFRES_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 relative overflow-hidden ${
                  type.couleur === 'green' ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                  type.couleur === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                  'bg-gradient-to-br from-orange-50 to-orange-100'
                }`}>
                  <img 
                    src={type.image} 
                    alt={type.nom}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className={`text-xl font-bold ${
                      type.couleur === 'green' ? 'text-green-700' :
                      type.couleur === 'blue' ? 'text-blue-700' : 'text-orange-700'
                    }`}>{type.nom}</h3>
                    <p className="text-sm text-accent">{type.sous_titre}</p>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground"><strong>Pour qui ?</strong></p>
                    <p>{type.cible}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Droit d'accès:</span>
                      <div className="text-right">
                        <span className="line-through text-red-500 text-xs mr-2">{formatMontant(type.droit_acces_normal)}/ha</span>
                        <span className="font-bold">{formatMontant(type.droit_acces_reduit)}/ha</span>
                      </div>
                    </div>
                    {!type.paiement_unique && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Abonnement:</span>
                        <span className="font-bold text-accent">{formatMontant(type.abonnement_jour)}/jour</span>
                      </div>
                    )}
                    {type.paiement_unique && (
                      <Badge variant="secondary">Paiement unique</Badge>
                    )}
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    {type.avantages.map((av, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span>{av}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Table des offres configurées */}
        <Card>
          <CardHeader>
            <CardTitle>Offres configurées</CardTitle>
            <CardDescription>
              Liste des offres enregistrées dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8">Chargement...</p>
            ) : offres && offres.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>DA Normal</TableHead>
                      <TableHead>DA Réduit</TableHead>
                      <TableHead>Abonnement/jour</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offres.map((offre) => (
                      <TableRow key={offre.id}>
                        <TableCell className="font-mono text-sm">{offre.code_offre}</TableCell>
                        <TableCell className="font-medium">{offre.nom_offre}</TableCell>
                        <TableCell>{formatMontant(offre.droit_acces_normal)}</TableCell>
                        <TableCell className="font-semibold text-primary">{formatMontant(offre.droit_acces_reduit)}</TableCell>
                        <TableCell>
                          {offre.paiement_unique ? (
                            <Badge variant="secondary">Unique</Badge>
                          ) : (
                            formatMontant(offre.abonnement_jour)
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={offre.actif ? "default" : "secondary"}>
                            {offre.actif ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(offre)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleStatusMutation.mutate({
                              id: offre.id,
                              actif: !offre.actif
                            })}
                          >
                            {offre.actif ? '⏸️' : '▶️'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Supprimer cette offre ?')) {
                                deleteMutation.mutate(offre.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune offre configurée. Les tarifs par défaut seront utilisés.</p>
                <p className="text-sm mt-2">Cliquez sur "Nouvelle Offre" pour configurer les tarifs.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Offres;