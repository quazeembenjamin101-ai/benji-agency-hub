<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- The owner CRM console lives at `/dashboard` (route `_authenticated/_admin/dashboard`), role-gated by the `admin` role. It must never be an index route under a pathless layout — that collides with `/`.
- The first person to sign up becomes the owner (admin) via the `handle_new_user` trigger; do not seed admin roles or sign up before the real owner.
- Benji AI runs server-side on the Lovable AI Gateway (`openai/gpt-6-astra`, Responses API) through `/api/public/chat`; do not move it to client-side calls.
