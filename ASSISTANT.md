# Private HAFS assistant

The **دستیار من** button opens an assistant for form drafting, project planning, and questions. The assistant reads only the active section's form fields when the user leaves the context checkbox enabled and sends a message. Replies are shown as plain text; the user can copy them or append them to a selected field. Existing project data continues to live in browser `localStorage`.

The assistant uses the OpenAI Responses API through a Vercel serverless function. The API key is never sent to the browser. The endpoint requires an owner session established with Sign in with ChatGPT. This is a separate API-powered assistant; it does not inherit this ChatGPT conversation or its memory.

### Activation

Sign in with ChatGPT currently requires an OpenAI-issued OAuth client. Register this exact production callback URL with OpenAI:

`https://project-ui-ai-temp-theta.vercel.app/api/auth/callback`

Configure these server-side environment variables in Vercel for Production and for any Preview domain whose callback has also been registered:

| Variable | Purpose |
| --- | --- |
| `HAFS_BASE_URL` | Exact HTTPS site origin, without a path |
| `HAFS_OWNER_EMAIL` | Verified email of the sole allowed ChatGPT account |
| `HAFS_SESSION_SECRET` | Random secret of at least 32 characters, generated with a cryptographic RNG |
| `OPENAI_CLIENT_ID` | Client ID supplied by OpenAI |
| `OPENAI_CLIENT_AUTH_METHOD` | `none` for a public client or `client_secret_basic` for a confidential client |
| `OPENAI_CLIENT_SECRET` | Required only for `client_secret_basic` |
| `OPENAI_API_KEY` | Server-side API key for assistant requests |
| `OPENAI_MODEL` | Optional, defaults to `gpt-5-mini` |

Use `.env.example` as the list of names, not as values. Keep `.env.local` out of Git. Run `npm install` and `npm test` locally. The login flow follows OpenAI's Authorization Code with PKCE and OpenID Connect guidance; the owner email must be verified in the ID token. The UI stays unavailable until the OAuth configuration is complete.

