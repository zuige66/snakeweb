import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from '../types';

interface SnakeGameProps {
    onExit: () => void;
}

const GRID_SIZE = 20;
const SPEED = 150;

// Direction vectors
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // To prevent multiple direction changes in one tick
    const directionChanged = useRef(false); 
    const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const generateFood = useCallback(() => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    }, []);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection(DIRECTIONS.RIGHT);
        setScore(0);
        setGameOver(false);
        setIsPaused(false);
        directionChanged.current = false;
    };

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameOver) return;
        
        if (e.key === 'p' || e.key === 'P') {
            setIsPaused(prev => !prev);
            return;
        }

        if (isPaused) return;

        // Prevent reversing direction
        if (directionChanged.current) return;

        switch (e.key) {
            case 'ArrowUp':
                if (direction !== DIRECTIONS.DOWN) setDirection(DIRECTIONS.UP);
                break;
            case 'ArrowDown':
                if (direction !== DIRECTIONS.UP) setDirection(DIRECTIONS.DOWN);
                break;
            case 'ArrowLeft':
                if (direction !== DIRECTIONS.RIGHT) setDirection(DIRECTIONS.LEFT);
                break;
            case 'ArrowRight':
                if (direction !== DIRECTIONS.LEFT) setDirection(DIRECTIONS.RIGHT);
                break;
        }
        directionChanged.current = true;
    }, [direction, gameOver, isPaused]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const moveSnake = useCallback(() => {
        if (gameOver || isPaused) return;

        setSnake(prevSnake => {
            const newHead = {
                x: prevSnake[0].x + direction.x,
                y: prevSnake[0].y + direction.y,
            };

            // Check walls
            if (
                newHead.x < 0 ||
                newHead.x >= GRID_SIZE ||
                newHead.y < 0 ||
                newHead.y >= GRID_SIZE
            ) {
                setGameOver(true);
                return prevSnake;
            }

            // Check self collision
            if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                setGameOver(true);
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            // Check food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 100);
                setFood(generateFood());
                // Grow: don't pop tail
            } else {
                newSnake.pop();
            }
            
            directionChanged.current = false;
            return newSnake;
        });
    }, [direction, food, gameOver, isPaused, generateFood]);

    useEffect(() => {
        gameLoopRef.current = setInterval(moveSnake, SPEED);
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [moveSnake]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-green-400 p-4 font-vt323">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-end mb-4 border-b-4 border-green-700 pb-2">
                <div>
                    <h2 className="text-2xl">SNAKE.EXE</h2>
                    <p className="text-sm text-gray-400">USE ARROW KEYS</p>
                </div>
                <div className="text-right">
                    <p className="text-xl">SCORE: {score}</p>
                </div>
            </div>

            {/* Game Board */}
            <div 
                className="relative bg-black border-4 border-green-600 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                style={{
                    width: '300px',
                    height: '300px',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                }}
            >
                {/* Pause Overlay */}
                {isPaused && !gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                        <p className="text-2xl animate-pulse">PAUSED</p>
                    </div>
                )}

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                        <p className="text-3xl text-red-500 mb-4">GAME OVER</p>
                        <p className="mb-6">FINAL SCORE: {score}</p>
                        <button 
                            onClick={resetGame}
                            className="px-4 py-2 border-2 border-green-400 hover:bg-green-400 hover:text-black transition-colors mb-4"
                        >
                            RETRY
                        </button>
                        <button 
                            onClick={onExit}
                            className="px-4 py-2 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                        >
                            EXIT
                        </button>
                    </div>
                )}

                {/* Grid Rendering */}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    
                    let isSnake = false;
                    let isHead = false;
                    snake.forEach((s, idx) => {
                        if (s.x === x && s.y === y) {
                            isSnake = true;
                            if (idx === 0) isHead = true;
                        }
                    });

                    const isFood = food.x === x && food.y === y;

                    return (
                        <div 
                            key={i} 
                            className={`
                                w-full h-full
                                ${isHead ? 'bg-green-300' : isSnake ? 'bg-green-600' : ''}
                                ${isFood ? 'bg-red-500 animate-pulse rounded-full' : ''}
                                ${!isSnake && !isFood ? 'bg-gray-900/50' : ''}
                            `}
                            style={{
                                boxShadow: isHead ? '0 0 5px #4ade80' : 'none'
                            }}
                        />
                    );
                })}
            </div>

            {/* Controls / Footer */}
            <div className="mt-6 flex gap-4">
                 <button onClick={onExit} className="text-xs text-gray-500 hover:text-white">[ ESC: EXIT ]</button>
                 <button onClick={() => setIsPaused(p => !p)} className="text-xs text-gray-500 hover:text-white">[ P: PAUSE ]</button>
            </div>
        </div>
    );
};

export default SnakeGame;