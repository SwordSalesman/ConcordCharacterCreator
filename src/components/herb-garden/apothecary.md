# Apothecary - High-Level Plan (Pet Project)

## Project Intent

Apothecary should prioritize fun game feel and experimentation over perfect balance. This is a clicker-style minigame and a learning sandbox for animation and game loops.

## Core Gameplay Loop

1. Harvest herbs (click + passive workers).
2. Craft potions from herbs.
3. Sell potions for money.
4. Spend money on recipes, workers, and Thunderoak.
5. Spend Thunderoak on beds and worker improvements.
6. Unlock commissions as expensive endgame progression.

Success criteria: the loop feels satisfying at minute 1, 10, and 30.

## Design Priorities

- Immediate feedback on player actions.
- Frequent visible progress (numbers moving often).
- Clear short plateaus followed by meaningful upgrades.
- Every purchase should make something noticeably faster or stronger.

## Tech Direction (Current Stack)

- Keep implementation inside existing Next.js + React + TypeScript app.
- Use current app conventions (context/hooks/data tables style).
- Use Tailwind for rapid UI iteration.
- No game engine required for this scope.

## State and Simulation Strategy

- Keep one authoritative game state.
- Separate simulation/economy logic from UI/animation logic.
- Use deterministic formulas for production, costs, and upgrades.
- Run passive systems on a regular tick/update cadence.
- Animate state changes, but do not let animation control game math.

## Hybrid Tick Loop (Chosen Direction)

Simulation is driven by a single global game clock.

- The game engine advances all economy logic every `x ms` based on elapsed time (`dt`).
- Passive gains/sales are computed from deterministic formulas, not per-worker timeouts.
- UI animation runs independently and can show staggered or timed visual feedback for delight.

Design intent:

- Brains: clock-based and deterministic.
- Feel: animated and expressive.

## Internal Math Loop (Deeper Structure)

One engine tick does the following in a fixed order:

1. Compute `dt` from global clock (`now - lastUpdateMs`).
2. Convert worker/upgrades into effective rates.
3. Apply farming production into herb accumulators.
4. Resolve crafting attempts from available herbs and known recipes.
5. Resolve selling attempts from available potion inventory.
6. Apply any timed modifiers/events (when implemented).
7. Convert accumulator fractions into whole resources and keep remainders.
8. Commit one authoritative state update.
9. Record delta payload for animation/event bus.

The order is intentional and should remain stable. Economy behavior changes if the order changes.

## Tick Cadence

- Recommended starting pulse: `100-250ms`.
- Use one scheduler for the entire simulation (not one timer per worker/system).
- Keep tick cadence separate from render cadence.

This avoids timer drift and keeps balancing predictable.

## Rate and Accumulator Model

Use rates for passive systems and accumulators for precision:

- Farmers generate herb-rate per second.
- Apothecaries generate craft-attempt-rate per second.
- Merchants generate sell-attempt-rate per second.
- Each system has a fractional accumulator that persists across ticks.

Per tick concept:

- `accumulator += ratePerSecond * dtSeconds`
- whole actions = floor(accumulator)
- `accumulator -= whole actions`

This preserves value over time and avoids losing tiny increments.

## Craft and Sell Resolution Rules

Crafting and selling should be bounded by inventory and resolved deterministically:

- Craft attempts cannot exceed available herb inputs.
- Sell attempts cannot exceed potion stock.
- If blocked, attempts remain effectively idle for that tick (no hidden debt queue).
- Optional UI can show idle reasons (e.g., "No herbs" / "No potions").

## Determinism and Debuggability

To keep tuning simple:

- Keep all economy formulas pure and side-effect free.
- Keep all random/event logic out of the core until needed.
- Log per-tick summaries in dev mode (rates, deltas, bottlenecks).
- Treat animation payloads as read-only snapshots of state deltas.

## Animation Decoupling Rule

Animation may suggest independent timers, but it must not drive or gate resources.

- Economy updates happen when the simulation ticks.
- UI may animate gains over time after receiving a delta.
- If animation drops frames or is disabled, economy remains correct.

This guarantees gameplay correctness independent of visual performance.

## Offline Progression (Current Decision)

Offline progression is intentionally out of scope for now.

- No catch-up simulation on reload at this stage.
- Keep architecture compatible with future `simulate(dt)` catch-up if desired later.

## Economy and Progression Notes

- Start with simple slow-exponential cost scaling.
- Use mostly additive gains early, then introduce modest multipliers.
- Maintain clear bottlenecks so choices matter.
- Keep next best purchase legible to the player.

## Future Note: Demand System (Not Implemented Yet)

- Potion sell price should eventually be influenced by demand.
- Each potion has its own demand value and a capped maximum.
- Demand recovers upward over time toward that cap.
- Selling a potion should reduce only that potion's demand by a small amount.
- This should encourage players to rotate production/sales across potion types for better profit.

## Worker Upgrade Philosophy

Each worker type has two tracks:

- Passive throughput (more output per timer cycle).
- Active click bonus (better manual actions tied to that system).

This supports both active and idle playstyles.

## Anime.js Learning Plan

Use anime.js to add game feel, not core logic.

Best first targets:

- Bed click impact (pulse/pop).
- Resource gain flyups.
- Craft/sell feedback bursts.
- Unlock reveal transitions.

Approach:

- Build 2-3 reusable animation patterns first.
- Reuse patterns across features before adding new ones.
- Add reduced-animation option if needed.

## Scope Rings (Delivery Strategy)

### Ring 1: Playable Prototype

Ring 1 is split into two steps so systems can be validated before visual polish.

### Ring 1.0: Brains + Simple UI

Goal: Prove the hybrid tick simulation, economy cadence, and bottlenecks with plain controls and text readouts.

Included systems:

- Herbs: Green Sunleaf (GS), Thronesboon (TB).
- Potion: Elixir Vitae (cost: 1 GS + 1 TB, sell value: 3 money).
- Workers: Farmer, Apothecary, Merchant.
- One global simulation pulse and deterministic update order.
- Minimal UI: counters, action buttons, worker buy buttons, debug readout.

Starting values:

- GS: 0
- TB: 0
- Elixir Vitae: 0
- Money: 0
- Thunderoak: 0
- Workers: Farmer 0, Apothecary 0, Merchant 0

Manual actions (base):

- Click GS bed: +1 GS
- Click TB bed: +1 TB
- Click craft Elixir Vitae: consume 1 GS + 1 TB, gain +1 potion
- Click sell Elixir Vitae: consume 1 potion, gain +3 money

Worker rates (starter tuning):

- Farmer: +0.40 herb actions/sec (split evenly: 50% GS, 50% TB)
- Apothecary: +0.25 craft attempts/sec
- Merchant: +0.30 sell attempts/sec

Worker costs (money):

- Farmer base 12, Apothecary base 18, Merchant base 15
- Cost scaling per same-type purchase: `nextCost = ceil(baseCost * 1.25^owned)`

Tick and math settings:

- Tick pulse target: 100ms.
- Use rate accumulators and whole-action resolution via floor.
- Keep economy counts integer; keep fractional progress in accumulators only.

Ring 1.0 acceptance checks:

- 5 minutes idle + occasional clicks results in visible steady progression.
- No resource desync between displayed values and internal totals.
- No negative resources under heavy spam clicking.
- Changing tick from 100ms to 200ms yields near-equivalent output over long windows.

### Ring 1.5: Placeholder Visual Pass + Basic Animation

Goal: Validate that animation cadence can be delightful while economy remains fully clock-driven.

Added on top of Ring 1.0:

- Placeholder bed, potion, and worker visuals (simple shapes/cards/icons).
- Delta-driven animation events from simulation output.
- Lightweight anime.js effects for interaction and passive gains.

Animation targets (first pass):

- Bed click pop/pulse.
- Floating `+resource` flyups from passive and active gains.
- Potion craft burst and coin sell burst.
- Worker card heartbeat/progress pulse (visual-only timing).

Hard separation rule:

- Animation timers must never grant resources.
- Animation can be delayed/dropped without affecting totals.
- Simulation is the single source of truth for all gains and costs.

Ring 1.5 acceptance checks:

- With animation disabled, economy output is identical.
- With low frame rate, economy output is still identical.
- Gain/sell feedback remains readable at higher worker counts.

### Ring 1 Exit Criteria

Ring 1 is complete when:

- Core loop feels rewarding with both active clicking and passive workers.
- First 10-15 minutes have clear next purchases and no deadlocks.
- Hybrid tick architecture is stable enough to scale into more herbs/recipes.

### Ring 2: Real Game Feel

- Expand to all herbs and multiple recipes.
- Add upgrade tracks and scaling passes.
- Tune pacing and bottlenecks.

### Ring 3: Personality and Endgame

- Random world events.
- Thunderoak expansion depth.
- Commission progression and flavor polish.

## Practical Build Rule

Prioritize fun and iteration speed over perfect systems. Ship small slices, playtest often, and tune numbers after interaction feel is strong.
