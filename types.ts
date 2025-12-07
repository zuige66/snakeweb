export enum AppState {
    BOOT = 'BOOT',
    MENU = 'MENU',
    GAME_SNAKE = 'GAME_SNAKE',
    MUSIC_PLAYER = 'MUSIC_PLAYER',
    AI_TERMINAL = 'AI_TERMINAL',
}

export interface SystemTime {
    hours: string;
    minutes: string;
}

export enum Colors {
    PRIMARY = '#4ade80', // green-400
    SECONDARY = '#facc15', // yellow-400
    ACCENT = '#f472b6', // pink-400
    BACKGROUND = '#050505',
    DARK = '#111827', // gray-900
}