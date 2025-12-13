-- Créer la fonction pour la mise à jour de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer la table configurations_systeme
CREATE TABLE IF NOT EXISTS public.configurations_systeme (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cle TEXT NOT NULL UNIQUE,
  valeur TEXT NOT NULL,
  description TEXT,
  categorie TEXT NOT NULL DEFAULT 'general',
  type_valeur TEXT NOT NULL DEFAULT 'text',
  modifiable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configurations_systeme ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "read_configurations" ON public.configurations_systeme FOR SELECT USING (true);
CREATE POLICY "write_configurations" ON public.configurations_systeme FOR ALL USING (true) WITH CHECK (true);

-- Trigger pour updated_at
CREATE TRIGGER update_configurations_systeme_updated_at
BEFORE UPDATE ON public.configurations_systeme
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();