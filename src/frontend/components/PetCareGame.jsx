





import React, { useState, useEffect } from 'react';
import learningEngine from '../utils/learningEngine';

const PetCareGame = () => {
  // Load from localStorage or use defaults
  const loadPetData = () => {
    const savedData = localStorage.getItem('petData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      currentRoom: 'garden',
      creatureStats: {
        happiness: 85,
        energy: 92,
        magic: 78
      },
      messageIndex: 0,
      critterType: 'koala' // Default to Koko the koala
    };
  };

  const savePetData = (data) => {
    localStorage.setItem('petData', JSON.stringify(data));
  };

  const [currentRoom, setCurrentRoom] = useState(loadPetData().currentRoom);
  const [creatureStats, setCreatureStats] = useState(loadPetData().creatureStats);
  const [messageIndex, setMessageIndex] = useState(loadPetData().messageIndex);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [critterType, setCritterType] = useState(loadPetData().critterType);

  const answerButtonRefs = useRef([]);
  const speechMessages = critterType === 'koala' ? [
    "Hi there! I'm Koko the koala! 🐨💕",
    "Want to play with me? 🎈",
    "I love eating eucalyptus leaves! 🍃",
    "You're my favorite friend! ✨",
    "Let's explore the forest together! 🌳",
    "Being with you makes me so happy! 😊"
  ] : [
    "I love spending time with you! 💕",
    "Want to play a game together? 🎮",
    "I'm getting a little hungry... 🍎",
    "You're the best friend ever! ✨",
    "Let's explore somewhere new! 🗺️",
    "I feel so happy when you're here! 😊"
  ];

  useEffect(() => {
    const interval = setInterval(updateSpeechBubble, 5000);
    return () => clearInterval(interval);
  }, [messageIndex]);

  // Initialize answer button refs when currentMiniGame changes
  useEffect(() => {
    if (currentMiniGame) {
      answerButtonRefs.current = Array(currentMiniGame.answers.length).fill().map((_, i) => React.createRef());
    }
  }, [currentMiniGame]);

  const updateSpeechBubble = () => {
    setMessageIndex(prevIndex => (prevIndex + 1) % speechMessages.length);
  };

  const petCreature = () => {
    // Increase happiness
    setCreatureStats(prevStats => {
      const newStats = {
        ...prevStats,
        happiness: Math.min(100, prevStats.happiness + 2)
      };
      savePetData({ currentRoom, creatureStats: newStats, messageIndex, critterType });
      return newStats;
    });

    if (critterType === 'koala') {
      // Create floating hearts for Koko
      createFloatingHearts();
      showNotification("Koko loves your pets! 💕");
    } else {
      showNotification("Sparkle loves your pets! 💕");
    }
  };

  const createFloatingHearts = () => {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    // Clear any existing hearts
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create floating hearts animation
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '💕';
      heart.style.left = (Math.random() * 60 - 30) + 'px';
      heart.style.animationDelay = (i * 0.2) + 's';

      container.appendChild(heart);

      // Remove heart after animation completes
      setTimeout(() => {
        if (container && heart.parentNode === container) {
          container.removeChild(heart);
        }
      }, 2000);
    }
  };

  const switchRoom = (room) => {
    setCurrentRoom(room);

    // Update creature based on room
    let newMessage;
    switch(room) {
      case 'kitchen':
        newMessage = "I'm so hungry! Can you feed me? 🍎";
        setTimeout(() => startFeedingGame(), 1000);
        break;
      case 'bathroom':
        newMessage = "Bath time! Let's get clean! 🛁";
        setTimeout(() => startBathGame(), 1000);
        break;
      case 'playroom':
        newMessage = "Let's play games together! 🎮";
        setTimeout(() => startPlayGame(), 1000);
        break;
      case 'bedroom':
        newMessage = "This room is so cozy! 🛏️";
        setTimeout(() => startDecorateGame(), 1000);
        break;
      case 'garden':
        newMessage = "I love exploring the garden! 🌳";
        setTimeout(() => startExploreGame(), 1000);
        break;
      default:
        newMessage = speechMessages[messageIndex];
    }

    // Show the room-specific message
    setTimeout(() => {
      alert(newMessage); // Temporary - will replace with proper UI
    }, 500);

    // Save current state
    savePetData({ currentRoom: room, creatureStats, messageIndex, critterType });
  };

  const showNotification = (message) => {
    alert(message); // Temporary - will replace with proper notification system
  };

  const startFeedingGame = () => {
    // Generate an educational math question for feeding
    const mathProblem = learningEngine.generateMathProblem();
    setCurrentMiniGame({
      type: 'feeding',
      content: `Sparkle found some berries! Help him count how many he has!\n\n${mathProblem.question}`,
      answers: mathProblem.answers,
      correct: mathProblem.correct,
      onCorrect: () => {
        // Increase happiness and energy
        setCreatureStats(prevStats => ({
          ...prevStats,
          happiness: Math.min(100, prevStats.happiness + 15),
          energy: Math.min(100, prevStats.energy + 10)
        }));
      }
    });
  };

  const startBathGame = () => {
    // Generate a science question for bathing
    const scienceQuestion = learningEngine.getRandomQuestion('science', 'easy');
    setCurrentMiniGame({
      type: 'bath',
      content: `Sparkle needs to learn about cleanliness!\n\n${scienceQuestion.question}`,
      answers: scienceQuestion.answers.map(a => a.text),
      correct: scienceQuestion.answers.findIndex(a => a.correct),
      onCorrect: () => {
        // Increase magic and happiness
        setCreatureStats(prevStats => ({
          ...prevStats,
          magic: Math.min(100, prevStats.magic + 20),
          happiness: Math.min(100, prevStats.happiness + 5)
        }));
      }
    });
  };

  const startPlayGame = () => {
    // Generate a math problem for playing
    const mathProblem = learningEngine.generateMathProblem();
    setCurrentMiniGame({
      type: 'play',
      content: `Let's play a counting game!\n\n${mathProblem.question}`,
      answers: mathProblem.answers,
      correct: mathProblem.correct,
      onCorrect: () => {
        // Increase energy and magic
        setCreatureStats(prevStats => ({
          ...prevStats,
          energy: Math.min(100, prevStats.energy + 25),
          magic: Math.min(100, prevStats.magic + 10)
        }));
      }
    });
  };

  const startDecorateGame = () => {
    // Generate a creative question for decorating
    setCurrentMiniGame({
      type: 'decorate',
      content: "What color should we paint Sparkle's room?\n\nChoose the best combination:",
      answers: ["Red + Blue", "Yellow + Green", "Blue + Purple"],
      correct: 0, // Red + Blue makes purple
      onCorrect: () => {
        // Increase happiness and magic
        setCreatureStats(prevStats => ({
          ...prevStats,
          happiness: Math.min(100, prevStats.happiness + 10),
          magic: Math.min(100, prevStats.magic + 15)
        }));
      }
    });
  };

  const startExploreGame = () => {
    // Generate a science fact question for exploring
    const scienceFact = learningEngine.generateScienceFact();
    setCurrentMiniGame({
      type: 'explore',
      content: `${scienceFact.question}`,
      answers: scienceFact.answers,
      correct: scienceFact.correct,
      onCorrect: () => {
        // Increase all stats slightly
        setCreatureStats(prevStats => ({
          ...prevStats,
          happiness: Math.min(100, prevStats.happiness + 5),
          energy: Math.min(100, prevStats.energy + 5),
          magic: Math.min(100, prevStats.magic + 5)
        }));
      }
    });
  };

  return (
    <div className="game-container mx-auto my-8 p-4 bg-white rounded-lg shadow-xl max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6">Pet Care Game</h2>

      {/* Stats Bar */}
      <div className="stats-bar space-y-2 mb-4">
        {['happiness', 'energy', 'magic'].map((stat) => (
          <div key={stat} className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm">
            <span className="text-xl mr-2">{getStatIcon(stat)}</span>
            <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(stat)}`}
                style={{ width: `${creatureStats[stat]}%` }}
              ></div>
            </div>
            <span className="ml-2 font-bold">{creatureStats[stat]}</span>
          </div>
        ))}
      </div>

      {/* Creature Area */}
      <div className="creature-area text-center mb-6">
        <div
          className="creature cursor-pointer mx-auto"
          onClick={petCreature}
          onTouchStart={petCreature} // Add touch support for tablets
        >
          {critterType === 'koala' ? (
            <img src="/assets/characters/koala-koko.svg" alt="Koko the koala" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto" />
          ) : (
            <div className="text-8xl">🐉</div>
          )}
        </div>
        <div className="creature-name text-xl font-bold mt-2">
          {critterType === 'koala' ? "Koko 🐨" : "Sparkle"}
        </div>

        {/* Speech Bubble */}
        <div className="speech-bubble bg-white p-4 rounded-lg shadow-md mt-4 max-w-xs mx-auto">
          {speechMessages[messageIndex]}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav flex justify-around items-center bg-gray-100 p-4 rounded-lg shadow-inner sm:flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {['kitchen', 'bathroom', 'playroom', 'bedroom', 'garden'].map((room) => (
          <button
            key={room}
            className="nav-button flex flex-col items-center px-2 py-3 rounded-lg hover:bg-indigo-100 transition-all mb-2 sm:mb-4 md:mb-0"
            onClick={() => switchRoom(room)}
            onTouchStart={() => switchRoom(room)} // Add touch support for tablets
          >
            <div className="nav-icon text-2xl">{getRoomIcon(room)}</div>
            <div className="nav-label text-xs font-bold mt-1">{room.charAt(0).toUpperCase() + room.slice(1)}</div>
          </button>
        ))}
      </div>



      {/* Mini Game Modal */}
      {currentMiniGame && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setCurrentMiniGame(null)}
            >
              ✖️
            </button>
            <h3 className="text-xl font-bold mb-4">{getMiniGameTitle(currentMiniGame.type)}</h3>
            <p className="mb-6 text-gray-700">{currentMiniGame.content}</p>

            <div className="grid grid-cols-2 gap-4">
              {currentMiniGame.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`mini-game-button p-3 rounded-lg transition-all ${
                    index === currentMiniGame.correct ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-bold`}

                  onClick={() => handleAnswerSelection(index, answerButtonRefs[index])}
                  onTouchStart={() => handleAnswerSelection(index, answerButtonRefs[index])} // Add touch support for tablets
                  ref={answerButtonRefs[index]}

                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

const getStatIcon = (stat) => {
  switch(stat) {
    case 'happiness': return '💖';
    case 'energy': return '⚡';
    case 'magic': return '✨';
    default: return '';
  }
};

const getStatColor = (stat) => {
  switch(stat) {
    case 'happiness': return 'bg-gradient-to-r from-pink-400 to-red-400';
    case 'energy': return 'bg-gradient-to-r from-green-400 to-teal-400';
    case 'magic': return 'bg-gradient-to-r from-purple-300 to-pink-300';
    default: return '';
  }
};

const getRoomIcon = (room) => {
  switch(room) {
    case 'kitchen': return '🍎';
    case 'bathroom': return '🛁';
    case 'playroom': return '🎮';
    case 'bedroom': return '🛏️';
    case 'garden': return '🌳';
    default: return '';
  }
};

  const getMiniGameTitle = (type) => {
    switch(type) {
      case 'feeding': return "🍎 Feeding Time!";
      case 'bath': return "🛁 Bath Time!";
      case 'play': return "🎮 Play Time!";
      case 'decorate': return "🖌️ Decorating Fun!";
      case 'explore': return "🌳 Exploration Adventure!";
      default: return "Mini Game";
    }
  };

  const handleAnswerSelection = (selectedIndex, buttonRef) => {
    if (!currentMiniGame) return;

    const isCorrect = selectedIndex === currentMiniGame.correct;
    let message = `You selected: ${currentMiniGame.answers[selectedIndex]}\n`;

    if (isCorrect) {
      message += "✅ Correct! ";
      message += critterType === 'koala' ? "Koko loves it!" : "Sparkle loves it!";
      // Award rewards
      if (currentMiniGame.onCorrect) {
        currentMiniGame.onCorrect();
      }
      // Save progress after correct answer
      savePetData({ currentRoom, creatureStats, messageIndex, critterType });

      // Add bounce animation for correct answer
      if (buttonRef && buttonRef.current) {
        const btn = buttonRef.current;
        btn.classList.add('animate-bounce');
        setTimeout(() => {
          btn.classList.remove('animate-bounce');
        }, 1000);
      }
    } else {
      message += "❌ Incorrect. Try again!";
    }

    alert(message); // Temporary - will replace with proper UI

    // Reset mini game after a short delay
    setTimeout(() => {
      setCurrentMiniGame(null);
    }, 1000);
  };

  return (
    <div className="game-container mx-auto my-8 p-4 bg-white rounded-lg shadow-xl max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6">Pet Care Game</h2>

      {/* Stats Bar */}
      <div className="stats-bar space-y-2 mb-4">
        {['happiness', 'energy', 'magic'].map((stat) => (
          <div key={stat} className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm">
            <span className="text-xl mr-2">{getStatIcon(stat)}</span>
            <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(stat)}`}
                style={{ width: `${creatureStats[stat]}%` }}
              ></div>
            </div>
            <span className="ml-2 font-bold">{creatureStats[stat]}</span>
          </div>
        ))}
      </div>

      {/* Creature Area */}
      <div className="creature-area text-center mb-6">
        <div
          className="creature cursor-pointer mx-auto"
          onClick={petCreature}
          onTouchStart={petCreature} // Add touch support for tablets
        >
          {critterType === 'koala' ? (
            <img src="/assets/characters/koala-koko.svg" alt="Koko the koala" className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto" />
          ) : (
            <div className="text-8xl">🐉</div>
          )}
        </div>
        <div className="creature-name text-xl font-bold mt-2">
          {critterType === 'koala' ? "Koko 🐨" : "Sparkle"}
        </div>

        {/* Speech Bubble */}
        <div className="speech-bubble bg-white p-4 rounded-lg shadow-md mt-4 max-w-xs mx-auto">
          {speechMessages[messageIndex]}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav flex justify-around items-center bg-gray-100 p-4 rounded-lg shadow-inner sm:flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {['kitchen', 'bathroom', 'playroom', 'bedroom', 'garden'].map((room) => (
          <button
            key={room}
            className="nav-button flex flex-col items-center px-2 py-3 rounded-lg hover:bg-indigo-100 transition-all mb-2 sm:mb-4 md:mb-0"
            onClick={() => switchRoom(room)}
            onTouchStart={() => switchRoom(room)} // Add touch support for tablets
          >
            <div className="nav-icon text-2xl">{getRoomIcon(room)}</div>
            <div className="nav-label text-xs font-bold mt-1">{room.charAt(0).toUpperCase() + room.slice(1)}</div>
          </button>
        ))}
      </div>

      {/* Floating Hearts for Koko */}
      <div className="floating-hearts" id="floatingHearts"></div>

      {/* Mini Game Modal */}
      {currentMiniGame && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setCurrentMiniGame(null)}
            >
              ✖️
            </button>
            <h3 className="text-xl font-bold mb-4">{getMiniGameTitle(currentMiniGame.type)}</h3>
            <p className="mb-6 text-gray-700">{currentMiniGame.content}</p>

            <div className="grid grid-cols-2 gap-4">
              {currentMiniGame.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`mini-game-button p-3 rounded-lg transition-all ${
                    index === currentMiniGame.correct ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-bold`}
                  onClick={() => handleAnswerSelection(index)}
                  onTouchStart={() => handleAnswerSelection(index)} // Add touch support for tablets

                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

export default PetCareGame;





