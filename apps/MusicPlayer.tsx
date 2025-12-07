import React, { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
    onExit: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onExit }) => {
    const [playing, setPlaying] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // Simulate bands for visualizer
    const bands = 16;
    const [heights, setHeights] = useState<number[]>(new Array(bands).fill(10));

    useEffect(() => {
        const updateVisualizer = () => {
            if (!playing) {
                setHeights(new Array(bands).fill(5));
                return;
            }
            
            // Generate pseudo-random heights based on a sine wave + noise to look like music
            const time = Date.now() / 200;
            const newHeights = heights.map((_, i) => {
                const noise = Math.random() * 50;
                const wave = Math.sin(time + i) * 30 + 30;
                return Math.min(100, Math.max(5, noise + wave));
            });
            setHeights(newHeights);
            
            animationRef.current = requestAnimationFrame(updateVisualizer);
        };

        if (playing) {
            updateVisualizer();
        } else {
            cancelAnimationFrame(animationRef.current);
            setHeights(new Array(bands).fill(5));
        }

        return () => cancelAnimationFrame(animationRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing]);

    // Canvas drawing for extra retro flair (starfield background)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const stars = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        }));

        const drawStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';
            
            stars.forEach(star => {
                star.x -= star.speed * (playing ? 5 : 0.5);
                if (star.x < 0) star.x = canvas.width;
                
                ctx.globalAlpha = Math.random() * 0.5 + 0.5;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(drawStars);
        };
        
        const starAnim = requestAnimationFrame(drawStars);
        return () => cancelAnimationFrame(starAnim);
    }, [playing]);

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full bg-purple-900 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
            
            <div className="z-10 w-full max-w-2xl p-8 border-4 border-pink-500 bg-black/60 backdrop-blur-md rounded-lg shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                <div className="flex justify-between items-center mb-8 border-b-2 border-pink-500/50 pb-4">
                    <div>
                        <h2 className="text-2xl text-pink-400">SYNTHWAVE.FM</h2>
                        <p className="text-xs text-pink-300/70">FREQ: 104.5 MHZ STEREO</p>
                    </div>
                    <div className="animate-pulse">
                        {playing ? (
                            <span className="text-green-400">▶ PLAYING</span>
                        ) : (
                            <span className="text-red-400">❚❚ PAUSED</span>
                        )}
                    </div>
                </div>

                {/* Visualizer Bars */}
                <div className="flex items-end justify-between h-32 gap-1 mb-8">
                    {heights.map((h, i) => (
                        <div 
                            key={i} 
                            className="w-full bg-gradient-to-t from-pink-600 via-purple-500 to-cyan-400 transition-all duration-75 ease-linear"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-6">
                    <button 
                        onClick={onExit} 
                        className="px-6 py-3 border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-all font-bold text-sm uppercase"
                    >
                        Eject
                    </button>
                    <button 
                        onClick={() => setPlaying(!playing)} 
                        className={`
                            px-6 py-3 border-2 transition-all font-bold text-sm uppercase
                            ${playing 
                                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
                                : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'
                            }
                        `}
                    >
                        {playing ? 'Stop' : 'Play'}
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-4 text-xs text-pink-300/50">
                NO SOUND CARD DETECTED. SIMULATION MODE ACTIVE.
            </div>
        </div>
    );
};

export default MusicPlayer;