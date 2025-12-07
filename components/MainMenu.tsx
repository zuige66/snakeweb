import React from 'react';
import { AppState } from '../types';

interface MainMenuProps {
  onSelectApp: (app: AppState) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectApp }) => {
  
  const apps = [
    { 
      id: AppState.GAME_SNAKE, 
      label: "SNAKE", 
      icon: "🐍", 
      desc: "CLASSIC REPTILE ACTION",
      color: "text-green-400 border-green-400 hover:bg-green-900/30"
    },
    { 
      id: AppState.MUSIC_PLAYER, 
      label: "TUNES", 
      icon: "🎵", 
      desc: "SYNTHWAVE VISUALIZER",
      color: "text-pink-400 border-pink-400 hover:bg-pink-900/30"
    },
    { 
      id: AppState.AI_TERMINAL, 
      label: "ORACLE", 
      icon: "🤖", 
      desc: "AI KNOWLEDGE BASE",
      color: "text-yellow-400 border-yellow-400 hover:bg-yellow-900/30"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="mb-12 text-center animate-pulse">
        <h1 className="text-4xl md:text-6xl text-white drop-shadow-[4px_4px_0_rgba(80,80,80,1)] mb-4">SELECT CARTRIDGE</h1>
        <div className="h-1 w-32 bg-white mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelectApp(app.id)}
            className={`
              group flex flex-col items-center justify-center p-8 
              border-4 ${app.color} 
              transition-all duration-100 transform hover:scale-105 hover:-translate-y-2 active:translate-y-0
              bg-black/50 backdrop-blur-sm
            `}
          >
            <span className="text-6xl mb-6 group-hover:animate-bounce">{app.icon}</span>
            <span className={`text-2xl font-bold mb-2 ${app.color.split(' ')[0]}`}>{app.label}</span>
            <span className="text-xs text-gray-400 font-sans">{app.desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-16 text-gray-500 text-xs uppercase">
        © 1989 RETROBIT SYSTEMS LTD.
      </div>
    </div>
  );
};

export default MainMenu;