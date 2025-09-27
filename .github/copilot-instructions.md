# Copilot Instructions for crdt-collab

## Project Overview
- **crdt-collab** is a collaborative whiteboard app built with React and Vite, using Yjs for real-time CRDT-based state synchronization.
- The main UI is in `src/`, with collaborative canvas logic in `src/canvas/` and Yjs setup in `src/yjssetup.js`.
- The app demonstrates multi-user drawing, live cursor sharing, and user presence via Yjs Awareness.

## Key Architectural Patterns
- **CRDT Data Flow:**
  - All drawing actions (strokes) are stored in a Yjs shared array (`strokes`), which is observed for real-time updates.
  - User presence and cursor positions are managed via Yjs Awareness, broadcasting `{cursor, name, color}` for each user.
- **Component Structure:**
  - `App.jsx` is the entry point; `SharedEditor.jsx` and `canvas/` components handle collaborative features.
  - `AiCanvasBoard.jsx` is the main collaborative canvas, handling drawing, remote cursor rendering, and user list display.
- **Styling:**
  - Uses Tailwind CSS utility classes for layout and style in JSX files.

## Developer Workflows
- **Start Dev Server:**
  - `pnpm install` (or `npm install`)
  - `pnpm dev` (or `npm run dev`) to launch Vite with HMR.
- **Linting:**
  - Run `pnpm lint` (or `npm run lint`) for ESLint checks. Config in `eslint.config.js`.
- **No formal test suite** is present as of this writing.

## Project-Specific Conventions
- **User Identity:**
  - Each user is assigned a random name and color on load (see `AiCanvasBoard.jsx`).
- **CRDT Integration:**
  - Always use Yjs shared types for collaborative state. Do not use React state for shared/collaborative data.
  - Use `awareness.setLocalStateField` for broadcasting presence/cursor info.
- **Canvas Drawing:**
  - Strokes are objects: `{x1, y1, x2, y2, author, color}`. See `AiCanvasBoard.jsx` for usage.
- **Component Communication:**
  - Pass Yjs shared types as props to components that need to observe or mutate collaborative state.

## Integration Points
- **Yjs:**
  - All real-time sync is via Yjs. See `src/yjssetup.js` for provider setup.
- **Vite:**
  - Vite is used for fast dev builds and HMR. Config in `vite.config.js`.

## Example: Adding a New Collaborative Feature
1. Define new shared state in Yjs (e.g., a new Y.Map or Y.Array).
2. Pass the shared type to relevant components as a prop.
3. Use `.observe` to react to changes, and `.set`/`.push` to update state.
4. Use Awareness for presence-related features.

## References
- Main canvas: `src/canvas/AiCanvasBoard.jsx`
- Yjs setup: `src/yjssetup.js`
- Entry: `src/App.jsx`, `src/SharedEditor.jsx`

---

If you add new collaborative features, document the Yjs data structure and awareness fields here.
