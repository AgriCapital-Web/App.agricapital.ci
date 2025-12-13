-- Tables géographiques
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.departements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  district_id UUID REFERENCES public.districts(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.sous_prefectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  departement_id UUID REFERENCES public.departements(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.villages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  sous_prefecture_id UUID REFERENCES public.sous_prefectures(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_complet TEXT,
  email TEXT,
  telephone TEXT,
  role TEXT DEFAULT 'user',
  equipe_id UUID,
  actif BOOLEAN DEFAULT true,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table promotions
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  pourcentage_reduction NUMERIC NOT NULL DEFAULT 0,
  date_debut TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  applique_toutes_offres BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table offres
CREATE TABLE public.offres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  montant_da_par_ha NUMERIC NOT NULL DEFAULT 30000,
  contribution_mensuelle_par_ha NUMERIC NOT NULL DEFAULT 1050,
  avantages JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  couleur TEXT DEFAULT '#00643C',
  ordre INTEGER DEFAULT 1,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table promotions_offres
CREATE TABLE public.promotions_offres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  offre_id UUID NOT NULL REFERENCES public.offres(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(promotion_id, offre_id)
);

-- Table souscripteurs
CREATE TABLE public.souscripteurs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenoms TEXT,
  telephone TEXT NOT NULL,
  email TEXT,
  date_naissance DATE,
  lieu_naissance TEXT,
  nationalite TEXT DEFAULT 'Ivoirienne',
  type_piece TEXT,
  numero_piece TEXT,
  photo_url TEXT,
  piece_recto_url TEXT,
  piece_verso_url TEXT,
  region_id UUID REFERENCES public.regions(id),
  district_id UUID REFERENCES public.districts(id),
  departement_id UUID REFERENCES public.departements(id),
  sous_prefecture_id UUID REFERENCES public.sous_prefectures(id),
  village_id UUID REFERENCES public.villages(id),
  localite TEXT,
  adresse TEXT,
  offre_id UUID REFERENCES public.offres(id),
  statut TEXT DEFAULT 'actif',
  technico_commercial_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table plantations
CREATE TABLE public.plantations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  souscripteur_id UUID NOT NULL REFERENCES public.souscripteurs(id) ON DELETE CASCADE,
  nom TEXT,
  superficie_ha NUMERIC NOT NULL DEFAULT 1,
  date_plantation DATE,
  annee_plantation INTEGER,
  age_plantation INTEGER,
  type_culture TEXT DEFAULT 'Palmier à huile',
  variete TEXT,
  densite_plants INTEGER,
  region_id UUID REFERENCES public.regions(id),
  district_id UUID REFERENCES public.districts(id),
  departement_id UUID REFERENCES public.departements(id),
  sous_prefecture_id UUID REFERENCES public.sous_prefectures(id),
  village_id UUID REFERENCES public.villages(id),
  localite TEXT,
  coordonnees_gps TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  statut TEXT DEFAULT 'actif',
  montant_da NUMERIC DEFAULT 30000,
  montant_contribution_mensuelle NUMERIC DEFAULT 1050,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table paiements
CREATE TABLE public.paiements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  souscripteur_id UUID REFERENCES public.souscripteurs(id),
  plantation_id UUID REFERENCES public.plantations(id),
  montant NUMERIC NOT NULL,
  type_paiement TEXT DEFAULT 'DA',
  mode_paiement TEXT DEFAULT 'Mobile Money',
  reference TEXT,
  statut TEXT DEFAULT 'en_attente',
  date_paiement TIMESTAMP WITH TIME ZONE,
  fedapay_transaction_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table account_requests
CREATE TABLE public.account_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  region_id UUID REFERENCES public.regions(id),
  departement_id UUID REFERENCES public.departements(id),
  district_id UUID REFERENCES public.districts(id),
  motif TEXT,
  statut TEXT DEFAULT 'en_attente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sous_prefectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions_offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.souscripteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;

-- Policies lecture publique
CREATE POLICY "read_regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "read_districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "read_departements" ON public.departements FOR SELECT USING (true);
CREATE POLICY "read_sous_prefectures" ON public.sous_prefectures FOR SELECT USING (true);
CREATE POLICY "read_villages" ON public.villages FOR SELECT USING (true);
CREATE POLICY "read_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "read_promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "read_offres" ON public.offres FOR SELECT USING (true);
CREATE POLICY "read_promotions_offres" ON public.promotions_offres FOR SELECT USING (true);
CREATE POLICY "read_souscripteurs" ON public.souscripteurs FOR SELECT USING (true);
CREATE POLICY "read_plantations" ON public.plantations FOR SELECT USING (true);
CREATE POLICY "read_paiements" ON public.paiements FOR SELECT USING (true);
CREATE POLICY "read_account_requests" ON public.account_requests FOR SELECT USING (true);

-- Policies écriture authentifiés
CREATE POLICY "write_profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_promotions" ON public.promotions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_offres" ON public.offres FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_promotions_offres" ON public.promotions_offres FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_souscripteurs" ON public.souscripteurs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_plantations" ON public.plantations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_paiements" ON public.paiements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_regions" ON public.regions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_districts" ON public.districts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_departements" ON public.departements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_sous_prefectures" ON public.sous_prefectures FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "write_villages" ON public.villages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "insert_account_requests" ON public.account_requests FOR INSERT WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.souscripteurs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.plantations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paiements;