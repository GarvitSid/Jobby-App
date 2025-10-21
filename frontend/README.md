# Jobby App Frontend

React + TanStack Query frontend for the Jobby App job board.

## Highlights

- Authenticated job browsing with filters and search
- Job detail view with save/apply actions
- Saved Jobs and Applied Jobs collections
- Pagination across job lists
- React Query caching and loading/error states

## Scripts

From this folder:

- `npm start` — start the Vite dev server
- `npm test` — run the Vitest suite
- `npm run build` — create a production build

## Environment

Set `VITE_API_URL` if the backend is not running at `http://localhost:5000`.

## Notes

- `reportWebVitals.js` was removed because this app is not using CRA’s perf reporting.
- Build outputs should stay out of git; the repo already ignores `build/` and `dist/` inside the frontend.
