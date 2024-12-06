import React, { useState, useEffect, useCallback } from 'react';

const foods = [
  { type: '🍎', points: 10 },
  { type: '🍌', points: 20 },
  { type: '🍇', points: 30 },
  { type: '🍉', points: 40 },
  { type: '🍒', points: 50 }
];

interface FoodCatchGameProps {
  onGameComplete: () => void;
}

const FoodCatchGame: React.FC<FoodCatchGameProps> = ({ onGameComplete }) => {
  const [basketPosition, setBasketPosition] = useState(50);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(true);
  const [pressedKeys, setPressedKeys] = useState(new Set());


  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setPressedKeys(prev => new Set([...prev, event.key]));
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key);
        return newKeys;
      });
    }
  }, []);

  // Smooth basket movement
  useEffect(() => {
    if (!isGameActive) return;

    const moveBasket = () => {
      const moveAmount = 5;
      setBasketPosition(prev => {
        let newPos = prev;
        if (pressedKeys.has('ArrowLeft')) {
          newPos -= moveAmount;
        }
        if (pressedKeys.has('ArrowRight')) {
          newPos += moveAmount;
        }
        return Math.max(0, Math.min(90, newPos));
      });
    };

    const movementInterval = setInterval(moveBasket, 16);
    return () => clearInterval(movementInterval);
  }, [pressedKeys, isGameActive]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Game timer
  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameActive(false);
          setTimeout(() => onGameComplete(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, onGameComplete]);

  // Generate falling food
  useEffect(() => {
    if (!isGameActive) return;

    const generateFood = () => {
      const newFood = {
        id: Date.now(),
        x: Math.random() * 90,
        y: -10,
        speed: 1 + Math.random() * 2,
        wobble: {
          amplitude: Math.random() * 30,
          frequency: 0.02 + Math.random() * 0.03,
          offset: Math.random() * Math.PI * 2
        },
        ...foods[Math.floor(Math.random() * foods.length)]
      };
      setFoodItems(prev => [...prev, newFood]);
    };

    const foodInterval = setInterval(generateFood, 1000);
    return () => clearInterval(foodInterval);
  }, [isGameActive]);

  // Food falling animation and collision detection
  useEffect(() => {
    if (!isGameActive) return;

    const fallInterval = setInterval(() => {
      setFoodItems(prev => 
        prev.map(food => {
          const newY = food.y + food.speed;
          const time = Date.now() * food.wobble.frequency;
          const wobbleX = food.x + Math.sin(time + food.wobble.offset) * food.wobble.amplitude;

          // Check for collision
          if (newY >= 85 && newY <= 95 && Math.abs(wobbleX - basketPosition) < 10) {
            setScore(s => s + food.points);
            return null;
          }

          return newY > 100 ? null : {
            ...food,
            y: newY,
            currentX: wobbleX
          };
        }).filter(Boolean)
      );
    }, 16);

    return () => clearInterval(fallInterval);
  }, [isGameActive, basketPosition]);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      <div className="game-area">
        {foodItems.map(food => (
          <div
            key={food.id}
            className="food-item"
            style={{
              left: `${food.currentX ?? food.x}%`,
              top: `${food.y}%`
            }}
          >
            {food.type}
          </div>
        ))}

        <div
          className="basket"
          style={{ left: `${basketPosition}%` }}
        >
          🧺
        </div>
      </div>

      {!isGameActive && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <p>Redirecting to career quiz...</p>
        </div>
      )}

      <div className="game-instructions">
        Use ← → arrow keys to move the basket
      </div>
    </div>
  );
};

export default FoodCatchGame;