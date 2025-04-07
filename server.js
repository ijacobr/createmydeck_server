const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static("public"));

const cards = [
    {
        id: "1",
        img: "images/aldorpeacekeeper.png",
        name: "Aldor Peacekeeper",
        cost: "3",
        attack: "3",
        health: "3",
        text: "Battlecry: Change an enemy minion's Attack to 1.",
    },
    {
        id: "2",
        img: "images/alexstrasza.png",
        name: "Alexstrasza",
        cost: "9",
        attack: "8",
        health: "8",
        text: "Battlecry: Set a hero's remaining Health to 15.",
    },
    {
        id: "3",
        img: "images/ancientbrewmaster.png",
        name: "Ancient Brewmaster",
        cost: "4",
        attack: "5",
        health: "4",
        text: "Battlecry: Return a friendly minion from the battlefield to your hand.",
    },
    {
        id: "4",
        img: "images/argentprotector.png",
        name: "Argent Protector",
        cost: "2",
        attack: "2",
        health: "2",
        text: "Battlecry: Give a friendly minion Divine Shield.",
    },
    {
        id: "5",
        img: "images/barongeddon.png",
        name: "Baron Geddon",
        cost: "7",
        attack: "7",
        health: "5",
        text: "At the end of your turn, deal 2 damage to ALL other characters.",
    },
    {
        id: "6",
        img: "images/boulderfistogre.png",
        name: "Boulderfist Ogre",
        cost: "6",
        attack: "6",
        health: "7",
        text: "This card has no special ability.",
    },
    {
        id: "7",
        img: "images/bootybaybodyguard.png",
        name: "Booty Bay Bodyguard",
        cost: "5",
        attack: "5",
        health: "4",
        text: "Taunt",
    },
    {
        id: "8",
        img: "images/captaingreenskin.png",
        name: "Captain Greenskin",
        cost: "5",
        attack: "5",
        health: "4",
        text: "Battlecry: Give your weapon +1/+1.",
    },
    {
        id: "9",
        img: "images/corehound.png",
        name: "Core Hound",
        cost: "7",
        attack: "9",
        health: "5",
        text: "This card has no special ability.",
    },
    {
        id: "10",
        img: "images/deathwing.png",
        name: "Deathwing",
        cost: "10",
        attack: "12",
        health: "12",
        text: "Battlecry: Destroy all other minions and discard your hand.",
    },
    {
        id: "11",
        img: "images/elitetaurenchieftain.png",
        name: "Elite Tauren Chieftain",
        cost: "5",
        attack: "5",
        health: "5",
        text: "Battlecry: Give both players the power to ROCK! (with a random Power Chord card)",
    },
    {
        id: "12",
        img: "images/frostelemental.png",
        name: "Frost Elemental",
        cost: "6",
        attack: "5",
        health: "5",
        text: "Battlecry: Freeze a character.",
    },
    {
        id: "13",
        img: "images/gelbinmekkatorque.png",
        name: "Gelbin Mekkatorque",
        cost: "6",
        attack: "6",
        health: "6",
        text: "Battlecry: Summon an AWESOME invention.",
    },
    {
        id: "14",
        img: "images/gruul.png",
        name: "Gruul",
        cost: "8",
        attack: "7",
        health: "7",
        text: "At the end of each turn, gain +1/+1.",
    },
    {
        id: "15",
        img: "images/guardianofkings.png",
        name: "Guardian of Kings",
        cost: "7",
        attack: "5",
        health: "6",
        text: "Battlecry: Restore 6 Health to your hero.",
    },
    {
        id: "16",
        img: "images/illidanstormrage.png",
        name: "Illidan Stormrage",
        cost: "6",
        attack: "7",
        health: "5",
        text: "Whenever you play a card, summon a 2/1 Flame of Azzinoth.",
    },
    {
        id: "17",
        img: "images/leeroyjenkins.png",
        name: "Leeroy Jenkins",
        cost: "4",
        attack: "6",
        health: "2",
        text: "Charge. Battlecry: Summon two 1/1 Whelps for your opponent.",
    },
    {
        id: "18",
        img: "images/lordofthearena.png",
        name: "Lord of the Arena",
        cost: "6",
        attack: "6",
        health: "5",
        text: "Taunt",
    },
    {
        id: "19",
        img: "images/moltengiant.png",
        name: "Molten Giant",
        cost: "20",
        attack: "8",
        health: "8",
        text: "Costs (1) less for each damage your hero has taken.",
    },
    {
        id: "20",
        img: "images/mountaingiant.png",
        name: "Mountain Giant",
        cost: "12",
        attack: "8",
        health: "8",
        text: "Costs (1) less for each other card in your hand.",
    },
    {
        id: "21",
        img: "images/nozdormu.png",
        name: "Nozdormu",
        cost: "9",
        attack: "8",
        health: "8",
        text: "Players only have 15 seconds to take their turns.",
    },
    {
        id: "22",
        img: "images/onyxia.png",
        name: "Onyxia",
        cost: "9",
        attack: "8",
        health: "8",
        text: "Battlecry: Summon 1/1 Whelps until your side of the battlefield is full.",
    },
    {
        id: "23",
        img: "images/ragnarosthefirelord.png",
        name: "Ragnaros the Firelord",
        cost: "8",
        attack: "8",
        health: "8",
        text: "Can't Attack. At the end of your turn, deal 8 damage to a random enemy.",
    },
    {
        id: "24",
        img: "images/ravenholdtassassin.png",
        name: "Ravenholdt Assassin",
        cost: "7",
        attack: "7",
        health: "5",
        text: "Stealth",
    },
    {
        id: "25",
        img: "images/seagiant.png",
        name: "Sea Giant",
        cost: "10",
        attack: "8",
        health: "8",
        text: "Costs (1) less for each other minion on the battlefield.",
    },
    {
        id: "26",
        img: "images/stormwindchampion.png",
        name: "Stormwind Champion",
        cost: "7",
        attack: "6",
        health: "6",
        text: "Your other minions have +1/+1.",
    },
    {
        id: "27",
        img: "images/thebeast.png",
        name: "The Beast",
        cost: "6",
        attack: "9",
        health: "7",
        text: "Deathrattle: Summon a 3/3 Pip Quickwit for your opponent.",
    },
    {
        id: "28",
        img: "images/tirionfordring.png",
        name: "Tirion Fordring",
        cost: "8",
        attack: "6",
        health: "6",
        text: "Divine Shield, Taunt. Deathrattle: Equip a 5/3 Ashbringer.",
    },
    {
        id: "29",
        img: "images/venturecomercenary.png",
        name: "Venture Co. Mercenary",
        cost: "5",
        attack: "7",
        health: "6",
        text: "Your minions cost (3) more.",
    },
    {
        id: "30",
        img: "images/wargolem.png",
        name: "War Golem",
        cost: "7",
        attack: "7",
        health: "7",
        text: "This card has no special ability.",
    },
];

// API route to provide cards data
app.get("/api/cards", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    const prettyJSON = JSON.stringify(cards, null, 2);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cards API</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <pre class="json-output">${prettyJSON}</pre>
      </body>
      </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
