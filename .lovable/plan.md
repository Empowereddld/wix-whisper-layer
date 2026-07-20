## Why the tote isn't showing yet

The `/shop/merch` page pulls products from Shopify's **Storefront API**, which only returns products that are **published to the "Headless" sales channel**. The most recent Storefront API response (captured a few minutes ago) still returns only 1 product — the Pause Please kids tee. Your new tote bag isn't in the response, which means Shopify isn't exposing it to the storefront token yet.

This is the exact same gate we hit when the tee first went live: the product was active in Shopify but not published to Headless, so the storefront couldn't see it.

## What to do (in Shopify admin, no code change needed)

1. Open the tote bag product in Shopify admin.
2. In the right sidebar, find **Sales channels and apps** (or **Publishing**).
3. Make sure **Headless** is checked (in addition to Online Store / any others).
4. Save.
5. Refresh `/shop/merch` — the tote should appear within seconds (React Query's staleTime is 5 min, but a hard refresh bypasses it).

## Also worth double-checking

- Product **Status** is set to **Active** (not Draft).
- At least one variant has **inventory tracking off** or **stock > 0**, otherwise it can show but not be purchasable.
- Product has at least one image (otherwise the card shows a "No image" placeholder but still renders).

## If it still doesn't appear after publishing to Headless

Options:

- I can query Shopify admin via the Shopify tools to confirm which sales channels the tote is published to (requires the Shopify auth token, which expired last turn — I'd need you to reconnect Shopify in chat first).
- Or, once published, I can add a small "Refresh products" button / shorten the React Query cache on the merch grid so newly published items appear faster.

## No code changes proposed right now

Since this is a Shopify publishing setting, not a frontend bug, I'm not planning any file edits. Approve this plan if you just want me to walk you through the Shopify steps, or reply with what you'd like me to do differently (e.g. reconnect Shopify and verify from the API side).