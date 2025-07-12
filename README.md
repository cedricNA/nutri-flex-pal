# Welcome to Nutri-Flex project

## Project info


## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/275ee7c3-d818-47e2-a3a1-f45b247974ed) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Environment Variables

- `VITE_SUPABASE_URL`: URL of your Supabase instance.
- `VITE_SUPABASE_ANON_KEY`: public anon key for your Supabase project.

## OpenRouter API Key

Some AI‑powered features like the chat assistant and personalized nutrition advice
require an API key from [OpenRouter](https://openrouter.ai/).

- Create an account on OpenRouter and generate a new API key.
- The application stores this key in your browser `localStorage` under the name
  `openrouter-api-key` when you enter it in the configuration screen.
- If you prefer, you can also expose it as an environment variable (for example,
  `OPENROUTER_API_KEY`) and adapt the code to load it automatically at startup.

## Supabase Setup

1. Copy `.env.example` to `.env` and provide values for
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) if you
   don't have it already.
3. Apply the migrations under `supabase/migrations/` by running either:

   ```sh
   supabase db push
   ```

   or use `supabase db reset` to recreate the database. This will apply all
   migrations, including the one that adds `start_date` and `end_date` to the
   `user_goals` table.


## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/275ee7c3-d818-47e2-a3a1-f45b247974ed) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Troubleshooting

- If login fails with a CORS error during token refresh, update your Supabase project settings to include the app's URL in the **Authorized Redirect URLs** and **Allowed Domains** lists.
- If `npm install` fails with peer dependency errors, run `npm install --legacy-peer-deps`.
- Execute `npm test` to run the Vitest unit tests.

- Run `npm test -- -t NotFound.test.tsx --run` to execute the NotFound page test once and exit.

## UX enhancements

This project now includes several usability improvements:

- Loading placeholders are implemented via custom Skeleton components.
- Profile fields support inline editing with automatic save and validation.
- Charts offer comparison mode with zoom and pan controls.
- Mobile navigation supports swipe gestures and pull-to-refresh.

## Meal calorie ratios

Planned meals automatically set their calorie targets using the active nutrition plan.
Ratios applied per meal type:

- Petit-déjeuner / breakfast: 25%
- Déjeuner / lunch: 35%
- Dîner / dinner: 30%
- Collation / snack: 10%

