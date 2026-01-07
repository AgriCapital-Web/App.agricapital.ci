import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const InteractiveMap = lazy(() => import("@/components/maps/InteractiveMap"));

interface Etape3Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export const Etape3Parcelle = ({ formData, updateFormData }: Etape3Props) => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [sousPrefectures, setSousPrefectures] = useState<any[]>([]);
  const [previews, setPreviews] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (formData.district_id) fetchRegions(formData.district_id);
  }, [formData.district_id]);

  useEffect(() => {
    if (formData.region_id) fetchDepartements(formData.region_id);
  }, [formData.region_id]);

  useEffect(() => {
    if (formData.departement_id) fetchSousPrefectures(formData.departement_id);
  }, [formData.departement_id]);

  const fetchDistricts = async () => {
    const { data } = await (supabase as any).from("districts").select("*").eq("est_actif", true).order("nom");
    setDistricts(data || []);
  };

  const fetchRegions = async (districtId: string) => {
    const { data } = await (supabase as any).from("regions").select("*").eq("district_id", districtId).eq("est_active", true).order("nom");
    setRegions(data || []);
  };

  const fetchDepartements = async (regionId: string) => {
    const { data } = await (supabase as any).from("departements").select("*").eq("region_id", regionId).eq("est_actif", true).order("nom");
    setDepartements(data || []);
  };

  const fetchSousPrefectures = async (departementId: string) => {
    const { data } = await (supabase as any).from("sous_prefectures").select("*").eq("departement_id", departementId).eq("est_active", true).order("nom");
    setSousPrefectures(data || []);
  };

  const handleFileSelect = (key: string, file: File) => {
    updateFormData({ [key]: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews({ ...previews, [key]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const captureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        updateFormData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
        });
      });
    }
  };

  const nombrePlants = formData.superficie_ha ? Math.round(formData.superficie_ha * 143) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Localisation de la parcelle</CardTitle>
          <CardDescription>Informations géographiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select
                value={formData.district_id}
                onValueChange={(value) => {
                  updateFormData({ district_id: value, region_id: null, departement_id: null, sous_prefecture_id: null });
                  setRegions([]);
                  setDepartements([]);
                  setSousPrefectures([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Région *</Label>
              <Select
                value={formData.region_id}
                onValueChange={(value) => {
                  updateFormData({ region_id: value, departement_id: null, sous_prefecture_id: null });
                  setDepartements([]);
                  setSousPrefectures([]);
                }}
                disabled={!formData.district_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departement">Département *</Label>
              <Select
                value={formData.departement_id}
                onValueChange={(value) => {
                  updateFormData({ departement_id: value, sous_prefecture_id: null });
                  setSousPrefectures([]);
                }}
                disabled={!formData.region_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departements.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sous_prefecture">Sous-préfecture *</Label>
              <Select
                value={formData.sous_prefecture_id}
                onValueChange={(value) => updateFormData({ sous_prefecture_id: value })}
                disabled={!formData.departement_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une sous-préfecture" />
                </SelectTrigger>
                <SelectContent>
                  {sousPrefectures.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>{sp.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="village">Village *</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) => updateFormData({ village: e.target.value })}
              placeholder="Ex: Village de Kounahiri"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Superficie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="superficie_ha">Superficie (hectares) *</Label>
            <Input
              id="superficie_ha"
              type="number"
              step="0.5"
              min="1"
              max="50"
              value={formData.superficie_ha}
              onChange={(e) => updateFormData({ superficie_ha: e.target.value })}
              required
            />
          </div>

          {nombrePlants > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">
                Nombre de plants calculé: <span className="text-lg text-primary">{nombrePlants}</span> plants
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ({formData.superficie_ha} ha × 143 plants/ha)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites de la parcelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limite_nord">Limite Nord *</Label>
              <Input
                id="limite_nord"
                value={formData.limite_nord}
                onChange={(e) => updateFormData({ limite_nord: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limite_sud">Limite Sud *</Label>
              <Input
                id="limite_sud"
                value={formData.limite_sud}
                onChange={(e) => updateFormData({ limite_sud: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limite_est">Limite Est *</Label>
              <Input
                id="limite_est"
                value={formData.limite_est}
                onChange={(e) => updateFormData({ limite_est: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limite_ouest">Limite Ouest *</Label>
              <Input
                id="limite_ouest"
                value={formData.limite_ouest}
                onChange={(e) => updateFormData({ limite_ouest: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coordonnées GPS (Recommandé)</CardTitle>
          <CardDescription>Cliquez sur la carte pour placer la parcelle ou utilisez "Ma position"</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement de la carte...</span>
            </div>
          }>
            <InteractiveMap
              mode="pick"
              position={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
              onPositionChange={(lat, lng, alt) => {
                updateFormData({
                  latitude: lat.toFixed(6),
                  longitude: lng.toFixed(6),
                  altitude: alt?.toFixed(2) || formData.altitude
                });
              }}
              height="300px"
            />
          </Suspense>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) => updateFormData({ longitude: e.target.value })}
                placeholder="Ex: -6.4502"
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altitude">Altitude (m)</Label>
              <Input
                id="altitude"
                type="number"
                step="any"
                value={formData.altitude || ""}
                onChange={(e) => updateFormData({ altitude: e.target.value })}
                placeholder="Automatique"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos de la parcelle (3 obligatoires)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Vue générale *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect('photo_1_file', file);
              }}
              required
            />
            {previews.photo_1_file && (
              <div className="relative mt-2">
                <img src={previews.photo_1_file} alt="Aperçu photo 1" className="w-full h-40 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ photo_1_file: null });
                    setPreviews({ ...previews, photo_1_file: "" });
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Vue délimitée (limites visibles) *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect('photo_2_file', file);
              }}
              required
            />
            {previews.photo_2_file && (
              <div className="relative mt-2">
                <img src={previews.photo_2_file} alt="Aperçu photo 2" className="w-full h-40 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ photo_2_file: null });
                    setPreviews({ ...previews, photo_2_file: "" });
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Vue alternative (autre angle) *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect('photo_3_file', file);
              }}
              required
            />
            {previews.photo_3_file && (
              <div className="relative mt-2">
                <img src={previews.photo_3_file} alt="Aperçu photo 3" className="w-full h-40 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ photo_3_file: null });
                    setPreviews({ ...previews, photo_3_file: "" });
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
