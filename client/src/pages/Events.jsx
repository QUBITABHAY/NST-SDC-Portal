import { useEffect, useState } from 'react';
import { getAllEvents } from '../api/events';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                // Sort by date (descending for past, ascending for upcoming usually better, but let's just sort descending overall first)
                // Actually, backend orders by -event_date usually.
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Failed to load events.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const now = new Date();

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.event_date);
        if (filter === 'upcoming') {
            return eventDate >= now;
        }
        if (filter === 'past') {
            return eventDate < now;
        }
        return true;
    });

    // Sort: Upcoming -> Ascending (Nearest first), Past -> Descending (Most recent first)
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const dateA = new Date(a.event_date);
        const dateB = new Date(b.event_date);
        if (filter === 'upcoming') {
            return dateA - dateB;
        }
        return dateB - dateA;
    });

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'workshop': return 'bg-purple-100 text-purple-700';
            case 'hackathon': return 'bg-orange-100 text-orange-700';
            case 'meetup': return 'bg-blue-100 text-blue-700';
            case 'webinar': return 'bg-indigo-100 text-indigo-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading events...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white">
                    <span className="text-[#00E0FF] text-4xl">{`>`}</span>
                    EVENT PROTOCOLS
                </h1>

                {/* Filter Tabs */}
                <div className="flex bg-[#0a0a0a] p-1 rounded-lg border border-[#333]">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${filter === 'upcoming'
                            ? 'bg-[#00E0FF]/10 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.1)] border border-[#00E0FF]/30'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${filter === 'past'
                            ? 'bg-[#00E0FF]/10 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.1)] border border-[#00E0FF]/30'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                            }`}
                    >
                        Past Log
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${filter === 'all'
                            ? 'bg-[#00E0FF]/10 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.1)] border border-[#00E0FF]/30'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                            }`}
                    >
                        All Signals
                    </button>
                </div>
            </div>

            {sortedEvents.length === 0 ? (
                <div className="text-center py-20 bg-[#0a0a0a] rounded-xl border border-dashed border-[#333]">
                    <Calendar className="mx-auto h-12 w-12 text-[#333] mb-3" />
                    <p className="text-gray-500 font-mono text-sm">NO SIGNAL DETECTED FOR THIS FILTER.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedEvents.map((event) => (
                        <div key={event.id} className="glass-panel rounded-xl overflow-hidden border border-[#333] hover:border-[#00E0FF]/50 transition-all hover:shadow-[0_0_20px_rgba(0,224,255,0.1)] flex flex-col h-full group">
                            {event.banner && (
                                <div className="h-48 overflow-hidden bg-[#0a0a0a] relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10 opacity-60"></div>
                                    <img
                                        src={event.banner}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter hover:contrast-125"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest font-mono backdrop-blur-md ${event.event_type === 'hackathon' ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' :
                                                event.event_type === 'workshop' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                                                    'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                            }`}>
                                            {event.event_type}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {!event.banner && (
                                <div className="h-2 bg-gradient-to-r from-[#00E0FF] to-blue-600 relative">
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest font-mono ${event.event_type === 'hackathon' ? 'bg-orange-500/10 text-orange-500 border-orange-500/50' :
                                                event.event_type === 'workshop' ? 'bg-purple-500/10 text-purple-400 border-purple-500/50' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/50'
                                            }`}>
                                            {event.event_type}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 flex-1 flex flex-col relative z-20">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 font-mono group-hover:text-[#00E0FF] transition-colors uppercase tracking-wide">{event.title}</h3>
                                    <div className="flex items-center text-gray-400 text-xs mb-1 font-mono">
                                        <Calendar size={14} className="mr-2 text-[#00E0FF]" />
                                        {new Date(event.event_date).toLocaleDateString(undefined, {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }).toUpperCase()}
                                    </div>
                                    <div className="flex items-center text-gray-400 text-xs font-mono">
                                        <Clock size={14} className="mr-2 text-[#00E0FF]" />
                                        {new Date(event.event_date).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 font-mono leading-relaxed border-l-2 border-[#333] pl-3 ml-1">
                                    {event.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-[#333] flex justify-between items-center">
                                    <div className="flex items-center text-gray-500 text-xs font-mono">
                                        <MapPin size={14} className="mr-1 text-[#00E0FF]" />
                                        <span className="truncate max-w-[150px] uppercase">{event.location}</span>
                                    </div>
                                    {event.meeting_link && (
                                        <a
                                            href={event.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00E0FF] hover:text-white text-xs font-bold font-mono border border-[#00E0FF]/30 px-3 py-1 rounded hover:bg-[#00E0FF]/10 transition-all uppercase"
                                        >
                                            [ ACCESS LINK ]
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
