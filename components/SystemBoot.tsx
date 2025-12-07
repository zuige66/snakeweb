import React, { useEffect, useState } from 'react';

interface SystemBootProps {
  onComplete: () => void;
}

const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      { text: "INITIALIZING BOOT SEQUENCE...", delay: 500 },
      { text: "CHECKING MEMORY... 64KB OK", delay: 1200 },
      { text: "LOADING VIDEO DRIVER... OK", delay: 1900 },
      { text: "MOUNTING CARTRIDGE SLOT... OK", delay: 2600 },
      { text: "ESTABLISHING UPLINK... OK", delay: 3200 },
      { text: "WELCOME TO RETROBIT OS", delay: 4000 },
    ];

    let mounted = true;

    const runSequence = async () => {
      for (const step of sequence) {
        if (!mounted) return;
        await new Promise(resolve => setTimeout(resolve, step.delay - (lines.length * 300))); // dynamic timing
        setLines(prev => [...prev, step.text]);
      }
      setTimeout(() => {
        if(mounted) onComplete();
      }, 1500);
    };

    runSequence();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-start justify-end h-full w-full p-10 text-green-400 font-mono text-sm md:text-lg uppercase leading-loose">
        {lines.map((line, i) => (
            <div key={i} className="animate-pulse">{`> ${line}`}</div>
        ))}
        <div className="mt-4 w-4 h-8 bg-green-400 animate-bounce inline-block" />
    </div>
  );
};

export default SystemBoot;