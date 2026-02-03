import { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete, mode = 'boot' }) => {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);

    const bootSequence = [
        "> INITIALIZING CORE SYSTEMS...",
        "> LOADING KERNEL MODULES... [OK]",
        "> ESTABLISHING SECURE CONNECTION...",
        "> VERIFYING SECURITY CERTIFICATES... [VERIFIED]",
        "> MOUNTING VIRTUAL FILE SYSTEM...",
        "> USER AUTHENTICATION HANDSHAKE...",
        "> ALL SYSTEMS GO."
    ];

    const transitionSequence = [
        "> ACCESSING DATABASE...",
        "> DECRYPTING SECURE CHANNELS...",
        "> RENDERING INTERFACE MODULE..."
    ];

    useEffect(() => {
        const sequence = mode === 'boot' ? bootSequence : transitionSequence;
        const lineSpeed = mode === 'boot' ? 500 : 150;
        const progressSpeed = mode === 'boot' ? 300 : 50;
        const completionDelay = mode === 'boot' ? 800 : 200;

        let currentLine = 0;
        const lineInterval = setInterval(() => {
            if (currentLine < sequence.length) {
                setLines(prev => [...prev, sequence[currentLine]]);
                currentLine++;
            } else {
                clearInterval(lineInterval);
            }
        }, lineSpeed);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(onComplete, completionDelay); // Wait a bit before finishing
                    return 100;
                }
                return prev + Math.floor(Math.random() * 10) + (mode === 'boot' ? 1 : 15);
            });
        }, progressSpeed);

        return () => {
            clearInterval(lineInterval);
            clearInterval(progressInterval);
        };
    }, [onComplete, mode]);

    return (
        <div className={`
            ${mode === 'boot' ? 'fixed inset-0 z-50' : 'absolute inset-0 z-40 bg-black/90 backdrop-blur-sm'}
            bg-[#050505] text-[#00E0FF] font-mono flex flex-col justify-center items-center p-8
        `}>
            <div className="w-full max-w-2xl">
                {mode === 'boot' && (
                    <div className="mb-8 font-bold text-2xl tracking-widest text-center animate-pulse">
                        NST SDC PORTAL v2.0
                    </div>
                )}

                <div className={`
                    overflow-hidden mb-6 text-sm md:text-base opacity-80 border-l-2 border-[#00E0FF] pl-4 bg-[#121212]/50 p-4 rounded shadow-[0_0_15px_rgba(0,224,255,0.1)]
                    ${mode === 'boot' ? 'h-48' : 'h-32'}
                `}>
                    {lines.map((line, index) => (
                        <div key={index} className="mb-1">{line}</div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>

                <div className="w-full h-2 bg-gray-900 rounded overflow-hidden border border-[#00E0FF]/30">
                    <div
                        className="h-full bg-[#00E0FF] shadow-[0_0_10px_#00E0FF] transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs mt-2 opacity-60">
                    <span>{mode === 'boot' ? 'SYSTEM STATUS: ONLINE' : 'LOADING DATA STREAMS...'}</span>
                    <span>{Math.min(progress, 100)}%</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
