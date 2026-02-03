import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoadingScreen from './LoadingScreen';

const Layout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Reset loading state when location changes (in case it wasn't handled)
    // or to ensure we show content after transition
    useEffect(() => {
        // Note: This runs AFTER the route change.
        // If we want the loading screen to persist UNTIL this happens, we rely on Sidebar starting it.
        // We can just ensure it turns off here.
        // But to ensure the "transition" visual has time to show, we might want a minimum time?
        // The LoadingScreen component itself handles the timer before calling onComplete.
        // So we just need to wait for onComplete.
    }, [location]);

    return (
        <div className="flex h-screen bg-[#050505]">
            <Sidebar onNavigate={() => setIsLoading(true)} />
            <main className="flex-1 overflow-y-auto relative bg-[#050505]">
                {isLoading && (
                    <LoadingScreen
                        mode="transition"
                        onComplete={() => setIsLoading(false)}
                    />
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
