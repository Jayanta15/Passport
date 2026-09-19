# Rize Passport - First Draft Changelog

## Materials Provided
- `Pasted-Rize-Passport-Replit-build-brief...`: The master product brief and scenario details.
- `Pasted--Rize-Passport-synthetic-data-generator-v2...`: The Python script for generating mock `attempts`, `domestic`, `outward`, and `summary` data.
- `Pasted--note-Rize-Passport-reference-data-v2...`: The source of truth for regulations, duty rates, verdicts, and rules (`reference.json`).

## Build Instructions
1. Port the Python generator to a local `rize_passport_seed.py` and run it to produce data in `public/data/`.
2. Save the reference text as `public/reference.json`.
3. Compute all dynamic values inside the app logic rather than relying solely on the text of the prompt.
4. Implement four core screens (Radar, Market Detail, Launch Plan, Price Builder) handling navigation seamlessly.
5. Create a dark, dense, financial-dashboard UI inspired by Razorpay Rize. Use monospaced fonts for numerals.
6. Provide visual feedback (tooltips, state changes, keyboard nav via 1/2/3/4).

## Changelog

- **Data Generation:** Python seed script was modified slightly to direct output to `public/data/`. A local shell executed the script successfully to create 4 `.json` artifacts.
- **Reference Parsing:** Extracted the reference JSON strictly to `public/reference.json`.
- **Theming:** Rewrote `index.css` to force a strict dark mode, adopting deep navy cards (`hsl(222, 36%, 11%)`) on a very dark background (`hsl(223, 39%, 7%)`) and the exact Razorpay blue accent (`hsl(211, 100%, 50%)`). Used `JetBrains Mono` for numerals and code blocks to hit the dense financial-dashboard vibe. Status colors explicitly assigned for GO (Green), WAIT (Amber), and BLOCKED (Red).
- **Core Engine:** Built `lib/compute.ts` to execute the verdict rules on the fly, calculating gross margin headroom and comparing values dynamically against the `readiness_checks` threshold from `reference.json`.
- **Radar (Screen 1):** Features a count-up component to dramatize the leaked revenue hook. Explicitly tracks the GST-to-ITC-HS bridge, a critical product feature distinguishing Passport from backward-looking dashboards. 
- **Market Detail (Screen 2):** Parses the generated results to render an explicit REFUSAL PANEL when the verdict is WAIT, mapping directly to the failing threshold.
- **Launch Plan (Screen 3):** Employs interactive checklist states and visually separates built vs brokered rails. Integrates the "sunscreen exception" logic specifically for US market. The ODI clock renders as a vertical timeline tracking India-side compliance steps.
- **Price Builder (Screen 4):** A full dashboard tabbed by HS code, comparing the cost floor (broken down into a visually layered stacked bar) against the observed willingness to pay, and the HS-matched peer band (with median markers).
- **UX Details:** Keyboard shortcuts (1, 2, 3, 4) added in the `App.tsx` layout to seamlessly switch screens during a live demo. Tooltips explain the data provenance on key figures. Muted the emoji use entirely in favor of strict text and lucide-icons.
