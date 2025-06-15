
-- Créer un enum pour les rôles
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Créer la table des rôles utilisateurs
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Créer une fonction pour vérifier les rôles (SECURITY DEFINER pour éviter la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Créer une fonction pour obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Politique RLS pour que les utilisateurs puissent voir leur propre rôle
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Politique RLS pour que les admins puissent voir tous les rôles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Politique RLS pour que les admins puissent gérer tous les rôles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Modifier la fonction handle_new_user pour assigner automatiquement le rôle 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  -- Assigner automatiquement le rôle 'user' aux nouveaux utilisateurs
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour les politiques RLS pour les aliments (seuls les admins peuvent ajouter des aliments)
DROP POLICY IF EXISTS "Authenticated users can insert foods" ON public.foods;
CREATE POLICY "Admins can insert foods" ON public.foods
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Politique pour que seuls les admins puissent modifier/supprimer des aliments
CREATE POLICY "Admins can update foods" ON public.foods
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete foods" ON public.foods
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
