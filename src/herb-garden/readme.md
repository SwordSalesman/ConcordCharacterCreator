'Apothecary' is a secret minigame in the Waystone website.

It is a pet project which will be made live once it's in a playable state. Mostly an exercise in game-loops and animation libraries.

It is a cookie-clicker game. The main rules are:

- Click garden beds to get herbs
- Use herbs to make known potions
- Sell potions to get money
- Money is used to buy more potion recipes, hire workers, and buy Thunderoak, and eventually commissions
- Thunderoak is used to build more garden beds, and build improvements to workers
- commissions are uber-expensive big investments which function as the end game progression

More granular rules:

- Herbs: There are 6 types of herbs, you start with a bed of Green Sunleaf (GS) and Thronesboon (TB). Herbs are harvested easily with a single click.
- Potions: There are many potion recipes, you start with the recipe for Elixir Vitae (requires 1 GS and 1 TB). Potions should be crafted easily with a single click. Potions can be sold easily with a single click. Potions with more herbs in them will sell for more money.
- Workers: Come in three types: Farmers, Apothecaries, and Merchants. Farmers automatically harvest herbs. Apothecaries automatically make potions. Merchants automatically sell potions. Each worker does it's task on some timer. Workers should be hired from 'the tavern'.
- The Exchange: Menu for buying upgrades. Can buy potion recipes for money. Can buy Thunderoak for money. Thunderoak is used to buy more garden beds, as well as provide upgrades to all workers.
- General Economy Scaling: All items of the same type (Thunderoak / more workers) or similar types (upgrading workers) will scale in cost by some algorithm. Probably a slow exponential scale. The idea is the first few upgrades come quick, then the game slows down as you ramp up production. Cookie clicker 101.
- Upgrading workers: Upgrades go in two paths for each type. Upgrading farmers means more herbs are gathered per second passively // each of your clicks nets more herbs. Upgrading apothecaries means more potions made per second passively // more potions made per click. Upgrading merchants means more potions sold per second passively // potions sell for more money.
- Events: Every so often, on a random timer, random events may happen. These will be cute references to the world, and introduce a bit of chaos and fun to the formula. Will iron these out later.
