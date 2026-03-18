

## Fix: Always scroll to top on page navigation

**Problem:** When navigating between pages via the header nav or buttons, the browser keeps the previous scroll position instead of starting at the top.

**Solution:** Add a `ScrollToTop` component that listens for route changes and scrolls to the top on every navigation (except browser back/forward).

**Changes:**

1. **Create `src/components/ScrollToTop.tsx`** — a small component using `useLocation` and `useNavigationType` from React Router to call `window.scrollTo(0, 0)` on route changes.

2. **Edit `src/App.tsx`** — add `<ScrollToTop />` inside `<BrowserRouter>`, before `<Routes>`.

