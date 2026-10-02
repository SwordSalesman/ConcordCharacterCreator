'herb-garden' is a secret minigame in the Waystone website.

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

Event notes:

- Events should come in the form of 'Letter received!' just like in Concord. You have 30 seconds to read the letter before it disappears. Opening the letter opens a popup which explains the situation and presents options.
- Could be a new building, 'Civil Service Office'? probably not - just have it appear then disappear.
- Shouldn't just be a tax or a boon, coz it feels not impactful either way.
- Should probably have a choice associated with it. Choices could be gated behind costs, like purchasing an upgrade. Choices could grant immediate windfalls, temporary buffs, or permanent buffs. Choices could also grant immediate taxes, or temporary debuffs.
- Events could have mini story lines because your choices could be saved as upgrades, so referenced in later events
- Event ideas:
    -

Sanctified Square

- It's a new building
- Unlocked via a Tavern purchase, 'Commission a Sanctified Square'.
- The gameplay loop here is ceremonies provided short term buffs but cost money to activate. A trade off the player decides which buff they want active.
- You cast a ceremony by clicking it.
- You can unlock ceremonies for keys just like potion recipes
    - Idea could be a new resource is unlocked: Crystal Mana, as well as hiring Priests. Priests generate crystal mana over time, you can't manually click for it. Ceremonies would cost CM instead of keys. Don't know if I love this tbh - the ceremonies are supposed to be on a timer anyway because you can only have one active, so having two timer based systems here feels odd.
- Ceremony ideas:
    - Blessing of New Spring (costs 4). Potions sell for 10% more.
    - Chamber of the Restful Warrior (costs 15). Farmers gather herbs faster.
    - Chamber of Delights (costs 15). Merchants sell potions faster.
    - Ward of Ironclad Vigor (costs 25). Potions are made faster.
    - Wondrous Forests of the Night (costs 100). Herbs are gathered twice as fast.

Mechanic ideas:

- Random events in the form of letters
- Ceremonies as opt-in buffs to particular buildings for big up-front costs

To Do:

- save/load progress to your profile
- end game screen when Throne is reached
- leaderboard with tracked TtT (Time to Throne)
- boghoffen hunting mechanic (click the treasure goblin)
- fix 'enter on keyboard' exploit
