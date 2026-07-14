Yes, changing the Empowered DLD logo in the Hub header to navigate to `/` is the clearest course of action. It follows the universal web convention that the site logo takes users to the public marketing homepage, and it solves the current problem where users inside the resource library have no obvious way back to the main website.

Plan:
1. In `src/components/hub/HubHeader.tsx`, change the logo button's `onClick={() => navigate("/hub")}` to `onClick={() => navigate("/")}` so it points to the marketing site homepage.
2. Confirm the logo is implemented as a button/link and does not require additional `href` changes.
3. (Optional) Add a "Resource Library" or "My Hub" item to the user dropdown menu so users can still return to the Hub dashboard from any page. If the user prefers minimal change, skip this step.
4. Run a TypeScript/typecheck to ensure no broken routes.

This is a small, low-risk change that immediately fixes the navigation dead-end while keeping the Hub's own pages accessible through their direct routes.