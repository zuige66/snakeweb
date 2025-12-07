import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';

interface AITerminalProps {
    onExit: () => void;
}

interface Message {
    id: string;
    sender: 'USER' | 'AI';
    text: string;
}

const AITerminal: React.FC<AITerminalProps> = ({ onExit }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', sender: 'AI', text: 'RETROBIT ORACLE V1.0 INITIALIZED. ASK ME ANYTHING.' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOffline, setIsOffline] = useState(false);

    // Check offline status on mount
    useEffect(() => {
        const apiKey = process.env.API_KEY;
        const missing = !apiKey || apiKey === "您的_GOOGLE_GEMINI_API_KEY" || apiKey.includes("API_KEY");
        setIsOffline(!!missing);
        
        if (missing) {
             setMessages(prev => [...prev, { 
                 id: 'offline-warning', 
                 sender: 'AI', 
                 text: 'WARNING: NO API KEY DETECTED. RUNNING IN LIMITED SIMULATION MODE.' 
             }]);
        }
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'USER', text: input.toUpperCase() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Construct history for Gemini
        const history = messages.map(m => ({
            role: m.sender === 'USER' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        try {
            const responseText = await getGeminiResponse(userMsg.text, history);
            const aiMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                sender: 'AI', 
                text: responseText.toUpperCase() // Maintain retro aesthetic
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'AI', text: 'ERROR PROCESSING REQUEST.' }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-blue-900 p-4 md:p-8 font-mono text-sm md:text-base">
            {/* Terminal Window */}
            <div className="flex-1 flex flex-col border-4 border-white bg-[#0000aa] shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-white text-[#0000aa] px-2 py-1 flex justify-between items-center font-bold">
                    <div className="flex gap-2 items-center">
                        <span>COMMAND PROMPT - ORACLE.EXE</span>
                        {isOffline && <span className="text-xs bg-red-500 text-white px-1 animate-pulse">OFFLINE</span>}
                    </div>
                    <button onClick={onExit} className="hover:bg-[#0000aa] hover:text-white px-2">X</button>
                </div>

                {/* Output Area */}
                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-vt323 text-xl leading-relaxed">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`mb-4 ${msg.sender === 'USER' ? 'text-yellow-300' : 'text-white'}`}>
                            <span className="mr-2 opacity-70">
                                {msg.sender === 'USER' ? '> USER:' : '> SYS:'}
                            </span>
                            <span className="whitespace-pre-wrap">{msg.text}</span>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-white animate-pulse">
                            {'> SYS: PROCESSING...'}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="bg-[#000088] p-2 border-t-2 border-white/30 flex">
                    <span className="text-yellow-300 mr-2 font-vt323 text-xl">{'>'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white font-vt323 text-xl uppercase placeholder-blue-400"
                        placeholder={isOffline ? "SIMULATION MODE..." : "TYPE COMMAND..."}
                        autoComplete="off"
                    />
                </form>
            </div>

            <div className="mt-2 text-center text-blue-300 text-xs">
                PRESS ENTER TO SEND • TYPE 'EXIT' OR CLICK X TO RETURN
            </div>
        </div>
    );
};

export default AITerminal;