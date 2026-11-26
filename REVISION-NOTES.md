# SoftSpace V2 — Development Notes

## Direction
- Independent Digital Studio led by Muhamad Fadil, paired with a developer portfolio and creative coding playground.
- Preserve the existing Hybrid Editorial × Experimental direction, the original logo asset, and restrained motion.
- Keep the implementation framework-free: HTML, CSS and vanilla JavaScript, with the existing GSAP / ScrollTrigger enhancement. No database or build step.

## Implemented in the V2 base
- Repositioned Home and Studio copy around SoftSpace as an independent digital studio.
- Updated navigation to Home, Studio, Capabilities, Services, Work, Lab and Contact. Journey remains part of the founder story.
- Expanded Skills into seven categories and added transparent experience labels: In practice, Practicing and Exploring.
- Added Services and a four-step working approach.
- Added project category filters and expanded project detail panels into Challenge / Approach / Outcome case-study summaries. Existing project statuses and demo caveats remain visible.
- Expanded the project inquiry form with project type, optional budget range and preferred timeline.
- Added an FAQ section. No fabricated testimonials were added; real testimonials can be added when permissioned feedback is available.
- Expanded the Lab from three to ten experiments: Swarm Simulation, Sound Grid, Code Playground, Gravity Playground, Generative Art, Wave Interference, Digital Terrain, Type in Motion, Color Laboratory and Sound Visualizer.
- Added `lab-extras.js` for the seven new Canvas / Web Audio experiments. New canvas animations stop when their tab is inactive; audio only starts after a user action.
- Added a scroll progress indicator, pointer-responsive ambient light, and subtle section/background motion while retaining the existing ambient Canvas and Hero Signal systems.
- Switched logo references to `assets/images/softspace-logo-original.png`; the image file itself is unchanged.

## Important content honesty
- Skills that are not yet demonstrated in current project content are marked Exploring or Practicing, not as expert-level claims.
- Existing projects remain identified as demos, coursework or practice builds where applicable.
- No fake client list, fabricated metrics or invented testimonials were added.

## Verification
- All six JavaScript files pass Node.js syntax checks.
- `style.css` parses without CSS syntax errors.
- Both HTML pages were checked for duplicate IDs, unresolved local assets and missing in-page anchor targets.
- The Lab has ten matching experiment tabs and panels; all seven additional experiment controllers are present.
- The seven new experiment controllers passed a mocked Canvas smoke test covering creation, activation, resize, pause, resume, reset and deactivation.
- A full visual browser pass could not be completed in the headless environment. Please do a final desktop and mobile visual review in a regular browser before publishing.


## Feedback refinement — Home and Lab interaction pass
- Reworked the Home hero from a broad promotional headline into a founder-led statement: “I build for the web. I experiment with it.” The accompanying copy now explains the relationship between SoftSpace, Muhamad Fadil, client-facing web work and browser-native experiments.
- Reframed the hero visual as a live field study with crosshair/coordinate markers and clearer interaction guidance. The Hero Signal Canvas remains the primary visual rather than relying on stock-style mockups or decorative template graphics.
- Strengthened the Home ambient field: brighter editorial blue/cyan contours, pointer-following influence, visible moving nodes, click ripples and scroll-reactive wave phase / glow drift. The darker Lab ambient palette and treatment were intentionally kept intact.
- Extended Home scroll choreography with hero parallax, scroll-linked service-card movement, animated section rules and the existing document scroll-progress indicator.
- Reworked the seven additional Lab studies to feel like distinct interactive experiments rather than simple animated canvases: multi-well gravity with trail control, selectable generative compositions, additive wave sources, layered terrain regeneration, pointer-displaced typography, selectable/copyable color harmonies and radial/waveform audio visualization.
- Improved experiment reset behaviour so controls and state return together: gravity force/trails, generative mode, visualizer mode and audio state now reset consistently.
- Preserved the Lab background animation that the user specifically liked, along with the three original experiments and the original SoftSpace logo asset.

## Feedback refinement verification
- All JavaScript files pass Node.js syntax checks.
- `style.css` parses without CSS syntax errors.
- `index.html` and `lab.html` contain no duplicate IDs and all referenced local assets exist.
- Ten Lab tabs match ten Lab panels; each additional experiment has its Canvas and standard pause/reset controls.
- Seven additional experiment controllers passed a mocked Canvas runtime smoke test covering creation, activation, pointer interaction, pause/resume, reset and deactivation; purpose-built controls were also confirmed to bind.
- A full visual browser pass remains outstanding because the available headless browser environment blocked page navigation. Please review the result in a regular desktop and mobile browser before publishing.


## Follow-up refinement — Transparent identity and Home hero
- Switched visible navigation and footer logos on Home and Lab to the existing transparent `softspace-logo-web.png` export. The original user-supplied logo file remains unchanged in the assets folder.
- Added `softspace-watermark-transparent.png`, copied from the existing transparent watermark export, and used it as a low-opacity, background-free Home watermark. The opaque social/banner artwork was left intact and is not used as a page watermark.
- Recomposed the Home hero around the SoftSpace wordmark, founder identity, plain-language description and work/Lab links.
- Removed the framed Hero Signal panel treatment; the existing pointer-reactive network canvas now blends into the Home background with restrained labels and a soft mask.
- Updated the entrance choreography for the new composition while keeping the existing Hero Signal and ambient animation engines.

## Follow-up refinement — Studio identity and Capabilities layout
- Rebuilt the Studio section into two clearly separated narratives: **About the Studio** explains SoftSpace's purpose and working principles; **Meet the Founder** introduces Muhamad Fadil as the person behind the independent practice.
- Reused the existing founder portrait asset without modifying the image. Added founder role labels, a concise first-person introduction, current focus areas and links to the founder's public profile and journey.
- Replaced the previous single long principles list with three editorial principle columns: Structure, Interaction and Curiosity.
- Rebalanced the Capabilities grid so the final **Tools & Workflow** category spans the full available row. Its six technology tiles use an adaptive layout so the right side is no longer left empty on desktop and the row remains responsive on smaller screens.
- Kept the existing seven skill categories, technology descriptions and experience labels; no proficiency claims or skill counts were inflated.

## Follow-up refinement verification
- All JavaScript files pass Node.js syntax checks.
- `style.css` parses without top-level CSS syntax errors.
- `index.html` has no duplicate IDs, unresolved local assets or broken in-page anchors.
- Studio overview, Meet the Founder, founder portrait and Capabilities mount point are present in the document.
- Automated Chromium screenshot attempt did not complete in the current environment; desktop and mobile visual review should still be performed in a regular browser.

## Follow-up refinement — Home / Lab cross-page transition
- Added a short, bidirectional particle-portal transition between the Home and Lab pages. On exit, the ambient particle field converges toward a central light point; on entry, the portal opens and the particles disperse as the destination page is revealed.
- Applied the transition to Home-to-Lab and Lab-to-Home links, including links that preserve a destination section/experiment hash. Same-page section navigation remains native smooth scrolling.
- Kept the interaction non-blocking: the outgoing cover is approximately 270 ms, followed by a 430 ms destination reveal. The overlay is pointer-transparent, does not capture focus, and never traps navigation.
- Preserved normal browser behaviour for modified clicks, middle-click/new-tab links, external links and download links. The transition is skipped when `prefers-reduced-motion: reduce` is active; if JavaScript or session storage is unavailable, navigation still works without relying on the transition.
- The transition uses a small temporary Canvas particle layer and CSS portal/ring treatment. It does not replace or alter the existing Home or Lab ambient background systems.

## Cross-page transition verification
- `page-transition.js` passes Node.js syntax validation.
- CSS parses without top-level syntax errors.
- A mocked runtime test passed for Home-to-Lab, Lab-to-Home, same-page anchor behaviour, reduced-motion bypass and Ctrl-click/new-tab behaviour.
- HTML navigation hooks, transition layer markup, local script references and in-page anchors were checked for both pages.
- A full visual browser pass could not be completed in the current environment; please do a final visual review in a regular browser before publishing.


## Follow-up refinement — Cross-page transition pacing
- Slowed the outgoing Home/Lab portal cover to 470 ms and the destination reveal to 780 ms, giving the particle convergence and ambient reveal more room to breathe without turning navigation into a long loading sequence.
- Replaced the sharper easing with a smoother ease-in-out curve for the portal and ring, and lengthened the small label/core details to match the main motion.
- Kept the transition non-blocking, bidirectional, and reduced-motion aware.

## Transition pacing verification
- JavaScript syntax and CSS parsing passed after the timing update.
- The navigation timeout and outgoing CSS duration both use 470 ms; the destination entrance uses 780 ms in both JavaScript and CSS.


## Follow-up refinement — Ambient Morph × Editorial Reveal
- Replaced the previous particle-portal transition with an ambient colour morph and a restrained editorial reveal between Home and Lab. The transition now grows from a horizontal editorial band, morphs between the light Studio palette and the dark Lab palette, and reveals the destination from the centre.
- Added a soft organic gradient mesh, subtle grid texture, editorial section label, title and divider line. Copy changes directionally between “ENTERING THE LAB” and “BACK TO THE STUDIO”. Text and rule colours morph with the background to preserve contrast.
- Preserved the independent animated ambient backgrounds on both pages; the transition is a temporary layer and does not replace either page's existing ambient canvas.
- Updated Home/Lab navigation state to use direction-specific entry classes. Same-page anchor scrolling, external links, downloads, modified clicks/new tabs and reduced-motion bypass remain unchanged. Navigation proceeds after the 780 ms outgoing reveal; the incoming reveal runs for 920 ms.

## Ambient Morph transition verification
- All project JavaScript files pass Node.js syntax validation.
- `style.css` parses without top-level CSS syntax errors.
- Both HTML pages have no duplicate IDs or missing local asset/script/style references.
- Runtime smoke tests pass for Home-to-Lab, Lab-to-Home, reduced-motion bypass and destination entry reveal.
- A full screenshot render could not be completed in the current headless browser environment; final desktop and mobile visual review should be done in a regular browser.

## Follow-up refinement — Transition performance optimization
- Rebuilt the cross-page transition around compositor-friendly `transform` and `opacity` animations. Removed full-screen `filter: blur()`, animated `clip-path`, and interpolated organic border-radius shapes from the transition layer.
- Kept the Ambient Morph × Editorial Reveal identity using static radial-gradient artwork whose position and opacity move subtly; the full-screen panel now slides as one layer rather than being continuously repainted while its shape changes.
- Shortened the outgoing cover to 640 ms and the destination reveal to 760 ms while preserving a deliberate, smooth pace.
- Added transition lifecycle events so the Home ambient canvas, Hero Signal canvas, active Lab simulations and visualizer pause while the page transition is active, then resume on the destination page. The Sound Grid timer stops when leaving the Lab.
- Added pointer-event guards to prevent hidden canvases from redrawing in response to mouse movement while the transition is covering the page.
- Kept reduced-motion bypass, normal section scrolling, modified-click behaviour, downloads and cross-page Home/Lab navigation intact.

## Transition performance verification
- All project JavaScript files pass Node.js syntax checks.
- `style.css` parses successfully with PostCSS.
- Transition CSS no longer uses filter blur, clip-path animation or border-radius interpolation.
- Runtime smoke tests pass for Home-to-Lab transition start, destination reveal cleanup and transition lifecycle events.
- Both HTML pages have unique IDs and all local asset, script, stylesheet and in-page references resolve.
- A real-device frame-rate benchmark and full browser visual review are not available in this environment; please test on the target desktop/mobile browser before publishing.

## Follow-up refinement — Smooth dynamic navigation & responsive access
- Reworked the dynamic navbar transition with a longer, eased geometry change for the floating compact state. The header now transitions its top offset, width, height, capsule radius, logo size, menu spacing and typography with a coordinated ease-out curve rather than several competing short transitions.
- Kept the same visual behaviour on Home and Lab while using page-specific light/dark surfaces. The Lab navbar retains its dark palette when scrolled or compact.
- Consolidated the compact-nav CSS to remove the earlier duplicate mobile/desktop compact rules that could override one another.
- Moved the tablet/mobile menu breakpoint to 960px so the full seven-item desktop navigation has more room before switching to a touch-friendly menu.
- Changed the mobile dropdown to an absolutely positioned panel attached to the navbar. It now follows the compact navbar naturally instead of relying on a fixed viewport offset; added minimum 48px touch rows, outside-tap dismissal, Escape handling, resize cleanup, scroll containment and short-landscape height handling.
- Added safe-area viewport metadata and `env(safe-area-inset-*)` spacing for notched devices. Kept viewport-height fallbacks for browsers without `dvh` support and added narrow-phone adjustments down to 360px.
- Throttled scroll-driven navbar/progress updates through `requestAnimationFrame` and retained passive scroll listening to avoid doing repeated class and progress updates within a single frame.
- Preserved reduced-motion behaviour and native link navigation.

## Responsive navigation verification
- All JavaScript files pass Node.js syntax checks; `style.css` parses with PostCSS.
- Both HTML pages declare a responsive viewport with `viewport-fit=cover`.
- Confirmed the nav breakpoint (960px) matches the JavaScript menu-reset breakpoint (960.01px), the old duplicate compact-nav block is removed, and the mobile dropdown follows the navbar via absolute positioning.
- Checked local page links, image/script/style references, and duplicate IDs on both pages. The Chromium headless screenshot attempt did not complete in this environment; please review desktop, tablet, mobile portrait and mobile landscape in a regular browser before publishing.

## Home first-entry intro — editorial studio signature
- Added a first-entry-only Home introduction with a restrained SoftSpace wordmark reveal, studio kicker, animated rule and an upward editorial curtain reveal into the Home hero.
- The intro is shown only on the first direct Home visit in a tab session. It does not replay when returning from the Lab through the existing Ambient Morph × Editorial Reveal navigation transition, nor on subsequent reloads in the same tab session.
- Kept the intro separate from the Home ↔ Lab transition overlay. If a visitor navigates to the Lab before the intro completes, the existing page transition takes visual priority and the intro exits quickly underneath it.
- Used compositor-friendly opacity and transform animations; the intro pauses the Home ambient and signal Canvas loops while its opaque cover is visible, then resumes them after the reveal.
- Added a no-intro path for `prefers-reduced-motion`, a fallback cleanup timer for background-tab animation suppression, and a small-screen layout for the intro footer.

## Home intro verification
- All JavaScript files pass `node --check` and the stylesheet parses successfully with PostCSS.
- Both Home and Lab pages have unique IDs, resolved local assets/scripts/styles, and valid in-page anchors.
- Simulated the Home bootstrap for first direct visit, same-tab repeat, Lab-to-Home destination entry and reduced-motion preference; the intro activates only for the first direct Home visit.
- A real browser visual/FPS test is still recommended on desktop and mobile; the current environment did not provide a reliable headless browser preview.


## Home first-entry intro — kinetic studio signature refinement
- Replaced the restrained centered wordmark/loading-screen treatment with a full-screen art-directed studio opening: split dark shutters, a subtle technical grid, ambient radial field, one compositor-friendly scan line, a large SoftSpace wordmark, founder attribution and a compact orbit/signal graphic.
- The sequence builds visual identity in layers, then opens the screen with a two-direction split reveal. It is designed to feel like an opening moment for the studio rather than a progress/loading screen.
- Kept motion on opacity and transforms; orbit elements rotate as lightweight CSS transforms. No new Canvas loop, blur filter or continuously repainted full-screen effect was added. Existing background Canvas loops pause during the intro and resume after it closes.
- Added responsive compositions for tablet and narrow phones, plus a reduced-motion path that skips the intro. The intro still runs only on the first direct Home entry in the tab session and does not replay when returning from the Lab.

## Home intro refinement verification
- Updated intro cleanup to listen for the top shutter's exit animation, with a 2.45-second fallback cleanup timer.
- JavaScript syntax, CSS parsing, HTML IDs, local references, and ZIP integrity checked after the redesign. Full visual review should still be performed in a regular desktop/mobile browser.


## Cursor signal and bilingual interface
- Added a restrained signal cursor for mouse/trackpad users: a small point and a softly trailing ring that expands on links, buttons, tabs and interactive experiment controls. Native pointer behaviour remains intact over reading/form areas; the custom cursor is disabled for touch/coarse pointers and reduced-motion preferences.
- Added a single `ID` / `EN` language switch in both Home and Lab navigation. It changes the interface without a reload, persists the selection with `localStorage`, and carries the selected language between pages.
- Added a shared translation dictionary and mutation-observer support so text rendered later by Home/Lab scripts, as well as accessible labels, placeholders and titles, can follow the selected language. The Lab canvas overlays/readouts respond to the same language-change event.
- Kept technical names and brand names (HTML, CSS, Canvas, GitHub, SoftSpace) unchanged where translation would reduce clarity. No translation API or database is used.
- Expanded the compact-navigation breakpoint to 1040px to make room for the new language control; synchronized the JavaScript menu reset breakpoint with the CSS breakpoint.

## Cursor and bilingual verification
- All JavaScript files pass `node --check`; stylesheet parses with `tinycss2`; both HTML documents have unique IDs, resolved local assets and valid local anchors.
- Verified both pages include the language control and shared cursor/translation scripts, and checked that the English/Indonesian dictionary covers visible explanatory copy in Home and Lab.
- A headless browser preview was blocked by the environment's browser navigation policy, so final visual interaction review should be done in a regular browser at desktop, tablet and mobile widths.


## Home first-entry intro — Digital Atmosphere
- Replaced the Kinetic Studio Opening with a lighter ambient introduction: soft blue/cyan light fields, a fine signal line with restrained nodes, and an editorial SoftSpace wordmark reveal.
- The final reveal uses only opacity and transform on a single cover layer; no extra Canvas, WebGL, large blur, filter or clip-path animation was introduced. Existing Home ambient and signal Canvas loops pause while the cover is visible and resume after it closes.
- Added a bilingual line, “A space for ideas to become experiences.” / “Ruang untuk ide menjadi pengalaman digital.” The rest of the intro uses the existing shared translation dictionary.
- The intro remains first-direct-Home-entry only per tab session, does not replay on return from Lab, exits promptly if Home/Lab navigation begins, and skips entirely for reduced-motion preferences.
- Refined responsive sizing for tablet, mobile, narrow phones and short landscape viewports.


## Signal cursor reliability fix
- Reworked cursor positioning to use a full-viewport fixed layer with absolutely positioned ring/dot children, avoiding nested fixed-position edge cases.
- Changed the pointer capability test to `any-hover` / `any-pointer`, so hybrid touch laptops with an attached mouse or trackpad still receive the custom cursor.
- Added the Hero Signal canvas and all Lab experiment canvases to the cursor's interactive target map; canvas hover now uses a slightly larger dashed ring.
- Made ring follow timing refresh-rate independent and cancel the animation frame when the cursor hides.
- Kept native text/select cursors on form controls, and preserved reduced-motion, visibility-change, blur, and page-transition behaviour.
