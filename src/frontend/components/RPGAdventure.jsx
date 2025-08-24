





import React, { useState } from 'react';

const RPGAdventure = () => {
  const [gameState, setGameState] = useState({
    level: 5,
    xp: 1300,
    xpToNext: 2000,
    power: 1247,
    stats: {
      health: 850,
      attack: 234,
      defense: 156,
      speed: 89,
      intelligence: 312
    },
    equipment: {
      crown: { name: "Magic Crown", rarity: "epic", stats: { intelligence: 50 } },
      armor: { name: "Dragon Scale Armor", rarity: "rare", stats: { defense: 75 } },
      weapon: { name: "Fire Sword", rarity: "legendary", stats: { attack: 120 } },
      ring: null
    },
    abilities: {
      fireball: { unlocked: true, cooldown: 0 },
      heal: { unlocked: true, cooldown: 0 },
      shield: { unlocked: true, cooldown: 0 },
      freeze: { unlocked: false, unlockLevel: 8 },
      lightning: { unlocked: false, unlockLevel: 12 }
    }
  });

  const [currentQuest, setCurrentQuest] = useState(null);

  // Educational content disguised as RPG quests
  const questDatabase = {
    dungeon: [
      {
        title: "🏰 The Number Crystal Dungeon",
        description: "Ancient number crystals are hidden in the dungeon! Help Sparkle solve the crystal puzzle to unlock the treasure chamber.",
        content: "Sparkle found 12 magic crystals, but 5 were cursed and crumbled away. How many crystals remain for the treasure?",
        answers: ["7", "17", "8", "5"],
        correct: 0,
        rewards: ["250 XP", "Fire Crystal", "Gold Coins"],
        subject: "math"
      },
      {
        title: "🏰 The Riddle of the Ancient Door",
        description: "A mysterious door blocks the path! Sparkle must read the ancient riddle to find the magic word that opens it.",
        content: "The riddle says: 'I am tall when I'm young, short when I'm old. What am I?' Choose the magic word:",
        answers: ["Candle", "Tree", "Mountain", "River"],
        correct: 0,
        rewards: ["300 XP", "Wisdom Scroll", "Magic Key"],
        subject: "reading"
      }
    ],
    forest: [
      {
        title: "🌲 The Color-Mixing Potion Quest",
        description: "Forest sprites need a special purple potion! Help Sparkle mix the right colors to create the magical brew.",
        content: "The sprites need purple potion for their magic. What colors should Sparkle mix together?",
        answers: ["Red + Blue", "Yellow + Green", "Red + Yellow", "Blue + Green"],
        correct: 0,
        rewards: ["200 XP", "Nature Essence", "Sprite Blessing"],
        subject: "science"
      }
    ],
    volcano: [
      {
        title: "🌋 The Dragon's Fire Challenge",
        description: "The Fire Dragon challenges Sparkle to a test of courage! Solve the pattern to prove your worth.",
        content: "Complete the fire pattern: 🔥🔥🌟🔥🔥🌟🔥🔥___",
        answers: ["🌟", "🔥", "💎", "⚡"],
        correct: 0,
        rewards: ["400 XP", "Dragon Scale", "Fire Immunity"],
        subject: "math"
      }
    ]
  };

  const startQuest = (quest) => {
    setCurrentQuest(quest);
    alert(`Starting quest: ${quest.title}\n\n${quest.description}`); // Temporary - will replace with proper UI
  };

  const selectAnswer = (answerIndex) => {
    if (!currentQuest) return;

    const isCorrect = answerIndex === currentQuest.correct;
    let message = `You selected: ${currentQuest.answers[answerIndex]}\n`;

    if (isCorrect) {
      message += "✅ Correct! You've completed the quest!";
      // Award rewards
      gainXP(200);
    } else {
      message += "❌ Incorrect. Try again!";
    }

    alert(message); // Temporary - will replace with proper UI

    // Reset current quest
    setCurrentQuest(null);
  };

  const gainXP = (amount) => {
    setGameState(prevState => {
      const newXp = prevState.xp + amount;
      let newLevel = prevState.level;

      if (newXp >= prevState.xpToNext) {
        newLevel++;
        // Reset XP for next level
        return {
          ...prevState,
          xp: newXp - prevState.xpToNext,
          xpToNext: Math.floor(prevState.xpToNext * 1.5),
          level: newLevel,
          power: prevState.power + 100
        };
      }

      return {
        ...prevState,
        xp: newXp,
        power: prevState.power + amount / 10
      };
    });
  };

  const petCreature = () => {
    gainXP(25);
    alert("Sparkle loves your pets! +25 XP"); // Temporary - will replace with proper UI
  };

  return (
    <div className="rpg-adventure mx-auto my-8 p-4 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 rounded-lg shadow-xl max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">RPG Adventure Game</h2>

      {/* HUD - Header */}
      <div className="rpg-hud p-4 bg-black bg-opacity-80 rounded-lg shadow-inner mb-4">
        <div className="flex justify-between items-center">
          <div className="text-yellow-300 font-bold">Level {gameState.level}</div>
          <div className="xp-bar flex items-center text-xs">
            <span className="mr-1 text-pink-300">XP:</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden mx-1">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                style={{ width: `${(gameState.xp / gameState.xpToNext) * 100}%` }}
              ></div>
            </div>
            <span className="ml-1 text-pink-300">{gameState.xp}/{gameState.xpToNext}</span>
          </div>
        </div>

        {/* Power Level */}
        <div className="power-level text-center mt-2">
          Power: {gameState.power.toLocaleString()}
        </div>
      </div>

      {/* Creature Area */}
      <div className="creature-area text-center mb-6 relative">
        <div
          className="creature text-8xl cursor-pointer mx-auto text-yellow-300"
          onClick={petCreature}
        >
          🐉
        </div>
        <div className="creature-name text-xl font-bold mt-2">Sparkle</div>
      </div>

      {/* Quest Selection */}
      <div className="quest-selection bg-black bg-opacity-70 p-4 rounded-lg shadow-inner">
        <h3 className="text-xl font-bold mb-4 text-yellow-300">Choose Your Adventure:</h3>

        {Object.keys(questDatabase).map((location) => (
          <div key={location} className="mb-6">
            <h4 className="text-lg font-semibold text-pink-300">{getLocationName(location)}</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {questDatabase[location].map((quest, index) => (
                <button
                  key={index}
                  className="quest-button bg-indigo-700 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-all"
                  onClick={() => startQuest(quest)}
                >
                  {quest.title}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Current Quest */}
        {currentQuest && (
          <div className="current-quest bg-purple-900 p-4 rounded-lg mt-6 shadow-inner">
            <h3 className="text-xl font-bold mb-2 text-yellow-300">Current Quest</h3>
            <p className="mb-4">{currentQuest.content}</p>

            <div className="grid grid-cols-2 gap-2">
              {currentQuest.answers.map((answer, index) => (
                <button
                  key={index}
                  className="answer-button bg-indigo-700 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-all"
                  onClick={() => selectAnswer(index)}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getLocationName = (location) => {
  switch(location) {
    case 'dungeon': return "🏰 The Enchanted Dungeon";
    case 'forest': return "🌲 Whispering Woods";
    case 'volcano': return "🌋 Dragon's Peak";
    default: return location.charAt(0).toUpperCase() + location.slice(1);
  }
};

export default RPGAdventure;







