import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are RetroBot, an intelligent assistant living inside an 8-bit game console from 1989.
Your personality is helpful but robotic and nostalgic.
You often use terms like "processing", "loading", "cartridge", "high score", and "game over".
Keep your responses concise and formatted for a small screen.
If asked about the system, describe yourself as the "RetroBit OS v1.0".
Do not use markdown formatting like bold or italics, as the terminal cannot render them well. Use uppercase for emphasis.
`;

// Simple local responses for offline mode
const MOCK_RESPONSES = [
  "OFFLINE MODE: UPLINK FAILED. RUNNING LOCAL DIAGNOSTICS.",
  "INSERT API CARTRIDGE FOR ADVANCED AI FUNCTIONS.",
  "I CAN HEAR YOU, BUT I CANNOT REACH THE CLOUD.",
  "MEMORY: 64KB. DISK: OK. NETWORK: DISCONNECTED.",
  "TRY PLAYING SNAKE WHILE YOU WAIT FOR INTERNET.",
  "SYSTEM STATUS: OPERATIONAL (RESTRICTED MODE).",
  "WITHOUT AN API KEY, I AM JUST A SCRIPT.",
  "BEEP BOOP. PLEASE CONFIGURE PROCESS.ENV.API_KEY.",
];

const getMockResponse = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('hello') || p.includes('hi')) return "GREETINGS, USER. WELCOME TO 1989.";
    if (p.includes('who') || p.includes('name')) return "I AM RETROBIT OS v1.0 (OFFLINE VERSION).";
    if (p.includes('game') || p.includes('play')) return "SNAKE IS AVAILABLE IN THE MAIN MENU.";
    if (p.includes('music') || p.includes('song')) return "THE SYNTHWAVE PLAYER IS OPERATIONAL.";
    if (p.includes('help')) return "COMMANDS UNAVAILABLE IN OFFLINE MODE.";
    
    // Return random fallback
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
};

export const getGeminiResponse = async (prompt: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  // Check if API key is missing or is the default placeholder
  const apiKey = process.env.API_KEY;
  const isMissingKey = !apiKey || apiKey === "您的_GOOGLE_GEMINI_API_KEY" || apiKey.includes("API_KEY");

  if (isMissingKey) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getMockResponse(prompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "ERROR: DATA CORRUPTED.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback to mock on actual API error too
    return "SYSTEM ERROR: CONNECTION LOST. SWITCHING TO LOCAL MODE.";
  }
};