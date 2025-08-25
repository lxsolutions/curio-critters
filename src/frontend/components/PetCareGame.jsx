


import React, { useEffect, useRef, useState } from 'react';
import { get, set } from "idb-keyval";
import soundEngine from '../utils/soundEngine';
import animationEngine from '../utils/animationEngine';

const PetCareGame = () => {
  const [creature, setCreature] = useState({
    id: null,
    name: 'Mystery Critter',
    type: 'fluffy_cat', // default
    happiness: 85,
    energy: 70,
    magic: 90,
    emoji: '🐱✨',
    level: 1,
    xp: 0,
    eggs: []
  });
  const [currentSpeechBubble, setCurrentSpeechBubble] = useState("Hello!");
  const [answers, setAnswers] = useState([
    { text: "Feed", isCorrect: true },
    { text: "Ignore", isCorrect: false }
  ]);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [performanceHistory, setPerformanceHistory] = useState([]);

  // Load user progress from IndexedDB or backend
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        // Try to get user data first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Load performance history from backend or IndexedDB
          let progressData;
          try {
            const response = await fetch(`/api/users/${userData.userId}/progress`, {
              headers: { 'Authorization': `Bearer ${userData.token}` }
            });
            if (response.ok) {
              progressData = await response.json();
            } else {
              // Fallback to IndexedDB
              progressData = await get(`performanceHistory_${userData.userId}`);
            }

            if (progressData && progressData.performanceHistory) {
              setPerformanceHistory(progressData.performanceHistory);
              setDifficultyLevel(calculateDifficulty(progressData.performanceHistory));
            }
          } catch (error) {
            console.error('Error loading performance history:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user progress:', error);
      }
    };

    loadUserProgress();
  }, []);

  // Initialize sound and animation engines when component mounts
  useEffect(() => {
    soundEngine.init();
    // Start background music using the sound engine
    if (process.env.NODE_ENV !== 'test') {
      soundEngine.play("backgroundMusic");
    }
  }, []);

  const answerButtonRefs = useRef([]);

  // Update speech bubble every 5 seconds
  useEffect(() => {
    const interval = setInterval(updateSpeechBubble, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateSpeechBubble = () => {
    // Logic to update speech bubble text
  };

  const saveProgress = async (data) => {
    try {
      if (!navigator.onLine) {
        // Store progress in IndexedDB for offline sync
        await set("pendingProgress", data);
      } else {
        // Send to server
        await fetch('/api/progress/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      // Fallback to IndexedDB if online save fails
      await set("pendingProgress", data);
    }
  };

  useEffect(() => {
    // Sync any pending progress when back online
    const handleOnline = async () => {
      const pending = await get("pendingProgress");
      if (pending) {
        try {
          await fetch('/api/progress/1', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pending)
          });
          // Clear pending progress after successful sync
          await del("pendingProgress");
        } catch (error) {
          console.error('Error syncing pending progress:', error);
        }
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleAnswerSelection = async (isCorrect) => {
    if (isCorrect) {
      soundEngine.play('correct');
      animationEngine.createSparkles();

      // Update performance history and difficulty
      setPerformanceHistory(prev => [...prev, { isCorrect: true, timestamp: Date.now() }]);
      const newDifficulty = calculateDifficulty([...performanceHistory, { isCorrect: true, timestamp: Date.now() }]);
      setDifficultyLevel(newDifficulty);

      // Update creature state based on difficulty
      if (newDifficulty === 3) {
        setCreature(prev => ({ ...prev, emoji: '🐨✨', happiness: Math.min(100, prev.happiness + 15) }));
        setCurrentSpeechBubble("You're amazing! Let's try something harder!");
      } else if (newDifficulty === 2) {
        setCreature(prev => ({ ...prev, emoji: '🐨😊', happiness: Math.min(100, prev.happiness + 10) }));
        setCurrentSpeechBubble("Great job! Keep it up!");
      } else {
        setCreature(prev => ({ ...prev, emoji: '🐨😃', happiness: Math.min(100, prev.happiness + 5) }));
        setCurrentSpeechBubble("Good answer!");
      }
    } else {
      soundEngine.play('wrong');
      animationEngine.shakeElement(answerButtonRefs.current[0]);

      // Update performance history
      setPerformanceHistory(prev => [...prev, { isCorrect: false, timestamp: Date.now() }]);
      const newDifficulty = calculateDifficulty([...performanceHistory, { isCorrect: false, timestamp: Date.now() }]);
      setDifficultyLevel(newDifficulty);

      // Update creature state based on difficulty
      if (newDifficulty === 1) {
        setCreature(prev => ({ ...prev, emoji: '🐨😞', happiness: Math.max(0, prev.happiness - 20) }));
        setCurrentSpeechBubble("That's okay! Let's try again.");
      } else {
        setCreature(prev => ({ ...prev, emoji: '🐨😢', happiness: Math.max(0, prev.happiness - 10) }));
        setCurrentSpeechBubble("Hmm, that's not right. Try again!");
      }
    }

    // Save progress to backend or IndexedDB
    const progressData = {
      performanceHistory: [...performanceHistory, { isCorrect, timestamp: Date.now() }],
      difficultyLevel,
      creatureState: creature
    };
    await saveProgress(progressData);
  };

  return (
    <div className="pet-care-game" role="main">
      <h1>Pet Care Game</h1>
      <div className="creature-stats" aria-label="Creature stats showing happiness, energy, and magic levels">
        <p>Happiness: {creature.happiness}</p>
        <p>Energy: {creature.energy}</p>
        <p>Magic: {creature.magic}</p>
      </div>
      <div className="creature-area" role="region" aria-label="Creature interaction area">
        <div className="room-info" aria-label="Current room">Living Room</div>
        <div className="creature" aria-label="Happy creature emoji"><span role="img" aria-label="happy creature emoji">{creature.emoji}</span></div>
        <div className="speech-bubble" aria-live="polite">
          {currentSpeechBubble}
        </div>
        <div className="sparkles-container" id="sparkleContainer" aria-hidden="true"></div>
      </div>
      <div className="answer-buttons" role="group" aria-label="Answer options for the current question">
        {answers.map((answer, index) => (
          <button
            key={index}
            ref={(el) => (answerButtonRefs.current[index] = el)}
            onClick={() => handleAnswerSelection(answer.isCorrect)}
            aria-pressed="false"
            tabIndex="0"
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// Calculate difficulty level based on performance history
const calculateDifficulty = (history, currentLevel) => {
  if (history.length === 0) return 1;

  // Count consecutive correct answers
  let consecutiveCorrect = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].isCorrect) {
      consecutiveCorrect++;
    } else {
      break;
    }
  }

  // Adjust difficulty based on performance
  if (consecutiveCorrect >= 5) return Math.min(3, currentLevel + 1); // Increase difficulty up to level 3
  if (history.filter(h => h.isCorrect).length / history.length < 0.4) return Math.max(1, currentLevel - 1); // Decrease for poor performance

  return currentLevel;
};

// Helper function to get critter emoji based on type
const getCritterEmoji = (type) => {
  switch(type) {
    case 'fluffy_cat': return '🐱✨';
    case 'unicorn_panda': return '🦄🐼';
    case 'dragon_bunny': return '🐇🔥';
    case 'rainbow_squirrel': return '🐿️🌈';
    case 'mermaid_fox': return '🦊🧜‍♀️';
    default: return '🐨'; // Default emoji
  }
};

export default PetCareGame;


