let xp = 0;
let health = 100;
let gold = 50;
let currentweapon = 0;
let fighting;
let monsterhealth;
let inventory = ["stick"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterhealthText = document.querySelector("#monsterHealth");

const weapons = [
    {
        name: "stick",
        power: 5,
    },
    {
        name: "dagger",
        power: 30,
    },
    {
        name: "claw hammer",
        power: 50,
    },
    {
        name: "sword",
        power: 100,
    },
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 20,
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60,
    },
    {
        name: "dragon",
        level: 20,
        health: 300,
    }, 
];


const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town! You see a sign that says \"Go to Store\" and \"Go to Cave\". You can also fight a dragon!",
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "Welcome to the store!",
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to Square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You are in the cave. You see some monsters!",
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster!",
    },
    {
        name: "kill monster",
        "button text": ["Go to town", "Go to town", "Go to town"],
        "button functions": [goTown, goTown, easterEgg],
        text: "The monster screems \"Arg!!\" as it dies. You gain gold and XP!",
    },
    {
        name: "lose",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You have been defeated!",
    },
    {
        name: "win",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You have defeated the dragon! You win!",
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You have found the easter egg! Pick a number above! Ten numbers will be randomly chosen between 0 to 10. If the number you choose matches one of the random numbers, you win!",
    },
];
// initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}
function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}


function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You don't have enough gold to buy health!";
    }
}

function buyWeapon() {
    if (currentweapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentweapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentweapon].name;
            inventory.push(newWeapon);
            text.innerText = "In your inventory you now have: " + inventory + ".";
        } else {
            text.innerText = "You don't have enough gold to buy a weapon!";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let soldWeapon = inventory.shift();
        currentweapon--; // remove the first weapon from the inventory
        text.innerText += "You sold your " + soldWeapon + " for 15 gold. In your inventory you now have: " + inventory + ".";
    } else {
        text.innerText = "You can't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterhealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterhealthText.innerText = monsterhealth;
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks you!";
    text.innerText += " You attack the " + monsters[fighting].name + " with your " + weapons[currentweapon].name + "!";
    if(isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += " You miss!";
    }
    monsterhealth -= weapons[currentweapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterhealthText.innerText = monsterhealth;
    if (health <= 0) {
        lose();
    } else if (monsterhealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster();
    }

    if (Math.random() <= 0.1 && inventory.length !== 1) {
        let brokenWeapon = inventory.pop();
        currentweapon = inventory.length - 1;
        text.innerText += " Your " + brokenWeapon + " breaks!";
    }
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) + (Math.floor(Math.random() * xp));
    console.log("Monster attack value: " + hit);
    return hit;
}

function isMonsterHit() {
    return Math.random() > 0.2 || health < 20; // 80% chance to hit, but if health is low, always hit
}
function dodge() {
    text.innerText = "You dodge the attack!";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}
function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentweapon = 0;
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;
    inventory = ["stick"];
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pickNumber(2);
}

function pickEight() {
    pickNumber(8);
}

function pickNumber(pickedNumber) {
    let numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + pickedNumber + ". Here are the random numbers:\n";
    for (let i = 0; i < numbers.length; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(pickedNumber) !== -1) {
        text.innerText += "Bingo!!! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Oops!! Sorry, you lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}
