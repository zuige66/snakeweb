import React, { useState, useEffect } from 'react';
import CRTLayer from './components/CRTLayer';
import SystemBoot from './components/SystemBoot';
import MainMenu from './components/MainMenu';
import SnakeGame from './apps/SnakeGame';
import MusicPlayer from './apps/MusicPlayer';
import AITerminal from './apps/AITerminal';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.BOOT);
  const [time, setTime] = useState<string>("00:00");

  // System clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBootComplete = () => {
    setAppState(AppState.MENU);
  };

  const returnToMenu = () => {
    setAppState(AppState.MENU);
  };

  // Render content based on state
  const renderContent = () => {
    switch (appState) {
      case AppState.BOOT:
        return <SystemBoot onComplete={handleBootComplete} />;
      case AppState.MENU:
        return <MainMenu onSelectApp={setAppState} />;
      case AppState.GAME_SNAKE:
        return <SnakeGame onExit={returnToMenu} />;
      case AppState.MUSIC_PLAYER:
        return <MusicPlayer onExit={returnToMenu} />;
      case AppState.AI_TERMINAL:
        return <AITerminal onExit={returnToMenu} />;
      default:
        return <MainMenu onSelectApp={setAppState} />;
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden flex flex-col font-['Press_Start_2P']">
      {/* Global CRT Overlay */}
      <CRTLayer />
      
      {/* Screen Container with Bezel effect */}
      <div className="relative z-10 flex-1 p-4 md:p-8 flex flex-col items-center justify-center">
          {/* Bezel/Monitor frame */}
          <div className="w-full h-full max-w-6xl border-[16px] border-gray-800 rounded-2xl bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)_inset] relative overflow-hidden">
                {/* Screen Inner Shadow/Glow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] z-20 rounded-lg"></div>
                
                {/* Status Bar (Only show if not booting) */}
                {appState !== AppState.BOOT && (
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex justify-between items-center px-4 z-30 border-b border-gray-700 text-[10px] md:text-xs text-gray-400">
                        <span>RETROBIT OS v1.0</span>
                        <div className="flex gap-4">
                           <span>MEM: 64KB</span>
                           <span className="text-green-500">{time}</span>
                        </div>
                    </div>
                )}

                {/* Main Display Area */}
                <div className="w-full h-full pt-8 pb-2 bg-[#050505]">
                    {renderContent()}
                </div>
          </div>
      </div>
      
      {/* TV/Console Power LED */}
      <div className="absolute bottom-4 right-8 z-20 flex items-center gap-2 opacity-70">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
        <span className="text-[10px] text-gray-600">POWER</span>
      </div>
    </div>
  );
};

export default App;