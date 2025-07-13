# Guide pour les Agents Codex

Ce dépôt contient le projet **Nutri-Flex** (React + TypeScript + Vite). Utilisez ce document pour configurer votre environnement et exécuter les principales commandes.

## Installation

1. Installez Node.js (version recommandée via `nvm`).
2. Clonez le dépôt puis installez les dépendances :
   ```sh
   npm install
   ```
   Si des erreurs de peer dependencies apparaissent, exécutez :
   ```sh
   npm install --legacy-peer-deps
   ```
3. Copiez le fichier `.env.example` vers `.env` et renseignez :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (optionnellement `OPENROUTER_API_KEY` si vous souhaitez éviter la saisie dans l'application).

## Commandes courantes

- Lancer le serveur de développement :
  ```sh
  npm run dev
  ```
- Générer une version de production :
  ```sh
  npm run build
  ```
- Prévisualiser la build :
  ```sh
  npm run preview
  ```
- Lint du code :
  ```sh
  npm run lint
  ```
- Exécuter les tests unitaires (Vitest) :
  ```sh
  npm test
  ```
  Un test spécifique peut être lancé avec :
  ```sh
  npm test -- -t NotFound.test.tsx --run
  ```

## Migrations Supabase

1. Installez le [CLI Supabase](https://supabase.com/docs/guides/cli) si nécessaire.
2. Appliquez les migrations depuis `supabase/migrations/` :
   ```sh
   supabase db push
   ```
   Vous pouvez aussi recréer la base avec :
   ```sh
   supabase db reset
   ```

## Clé OpenRouter

Certaines fonctionnalités IA requièrent une clé API provenant de [OpenRouter](https://openrouter.ai/). L'application la stocke dans `localStorage` sous le nom `openrouter-api-key` lorsque vous l'indiquez dans l'interface. Vous pouvez également définir la variable d'environnement `OPENROUTER_API_KEY` et adapter le code si besoin.

## Déploiement via Lovable

Le projet peut être publié directement depuis [Lovable](https://lovable.dev/projects/275ee7c3-d818-47e2-a3a1-f45b247974ed) via *Share → Publish*. Un domaine personnalisé peut être connecté depuis **Project > Settings > Domains**.

## Divers

- Si la connexion échoue à cause de CORS lors du rafraîchissement de token, ajoutez l’URL de l’application dans les paramètres de redirection et de domaines autorisés de Supabase.
- Les ratios de calories des repas sont : petit‑déjeuner 25 %, déjeuner 35 %, dîner 30 %, collation 10 %.

