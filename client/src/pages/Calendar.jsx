import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MoreHorizontal,
    X, MapPin, Users, AlignLeft, Search, HelpCircle, Settings, Menu
} from 'lucide-react';
import { getAllEvents } from '../api/events';

// --- Modal Components ---

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const styleColors = {
        meetup: 'bg-blue-600/20 text-blue-400 border border-blue-500/50',
        workshop: 'bg-purple-600/20 text-purple-400 border border-purple-500/50',
        hackathon: 'bg-orange-600/20 text-orange-400 border border-orange-500/50',
        webinar: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50',
        other: 'bg-gray-600/20 text-gray-400 border border-gray-500/50',
        default: 'bg-blue-600/20 text-blue-400 border border-blue-500/50'
    };

    const headerColor = styleColors[event.type] || styleColors.default;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] rounded-xl border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className={`px-6 py-4 flex justify-between items-start border-b border-[#333] bg-[#111]`}>
                    <h3 className="text-white text-lg font-bold tracking-wide font-mono uppercase">Event Protocol</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full hover:bg-white/10 p-1 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#00E0FF] mb-4 font-mono">{event.title}</h2>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-4" />
                            <div>
                                <p className="text-gray-200 font-mono text-sm uppercase">
                                    {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-gray-500 text-xs font-mono">{event.startTime} - {event.endTime}</p>
                            </div>
                        </div>

                        {event.description && (
                            <div className="flex items-start">
                                <AlignLeft className="w-5 h-5 text-gray-500 mt-0.5 mr-4" />
                                <p className="text-gray-400 text-sm leading-relaxed font-mono border-l border-[#333] pl-3">{event.description}</p>
                            </div>
                        )}

                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-500 mr-4" />
                            <p className="text-gray-400 text-sm font-mono uppercase">{event.location}</p>
                        </div>

                        {event.meeting_link && (
                            <div className="flex items-center">
                                <div className="w-5 mr-4"></div>
                                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="text-[#00E0FF] text-sm hover:text-white font-mono uppercase border border-[#00E0FF]/30 px-3 py-1 rounded bg-[#00E0FF]/10 transition-all">
                                    [ INITIALIZE CONNECTION ]
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const Calendar = () => {
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month'); // month, week, day, list
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getAllEvents();
                // Map backend data to calendar format
                const mappedEvents = data.map(event => {
                    const dateObj = new Date(event.event_date);
                    return {
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        date: dateObj,
                        startTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        endTime: new Date(dateObj.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Assume 1 hour duration if not specified
                        type: event.event_type || 'meetup',
                        location: event.location || 'Online',
                        meeting_link: event.meeting_link
                    };
                });
                setMeetings(mappedEvents);
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // Filter Logic
    const filteredMeetings = meetings.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const days = getDaysInMonth(currentDate);
    const weekDaysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getEventTypeStyles = (type) => {
        switch (type) {
            case 'meetup': return 'bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded';
            case 'workshop': return 'bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded';
            case 'hackathon': return 'bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded';
            case 'webinar': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 rounded';
            default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/40 rounded';
        }
    };

    // Render Views
    const renderMonthView = () => (
        <div className="flex-1 flex flex-col h-full bg-[#050505]">
            <div className="grid grid-cols-7 border-b border-[#333]">
                {weekDaysList.map(day => (
                    <div key={day} className="py-2 text-[10px] font-bold text-center text-gray-500 font-mono uppercase border-r border-[#333] last:border-r-0 tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(100px,_1fr)] overflow-y-auto">
                {days.map((day, index) => {
                    const isToday = day && isSameDay(day, new Date());
                    const dayEvents = day ? filteredMeetings.filter(m => isSameDay(m.date, day)) : [];
                    return (
                        <div key={index} className={`border-b border-r border-[#333] min-h-[100px] p-2 transition-colors duration-200 ${!day ? 'bg-[#0a0a0a]' : 'bg-[#050505] hover:bg-[#0a0a0a]'}`}>
                            {day && (
                                <>
                                    <div className="flex justify-center mt-1 mb-2">
                                        <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded transition-all duration-300 ${isToday ? 'bg-[#00E0FF] text-black shadow-[0_0_10px_#00E0FF]' : 'text-gray-500 hover:text-white'}`}>
                                            {day.getDate()}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => setSelectedEvent(event)}
                                                className={`text-[9px] px-1 py-0.5 font-mono truncate cursor-pointer hover:opacity-80 transition-opacity uppercase tracking-tight ${getEventTypeStyles(event.type)}`}
                                            >
                                                {event.startTime} {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderWeekView = () => {
        const weekDates = getWeekDays(currentDate);
        return (
            <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden">
                <div className="grid grid-cols-7 border-b border-[#333]">
                    {weekDates.map((date, i) => (
                        <div key={i} className={`py-4 text-center border-r border-[#333] last:border-r-0 ${isSameDay(date, new Date()) ? 'bg-[#00E0FF]/5' : ''}`}>
                            <div className={`text-[10px] font-bold uppercase font-mono tracking-wider ${isSameDay(date, new Date()) ? 'text-[#00E0FF]' : 'text-gray-500'}`}>{weekDaysList[i]}</div>
                            <div className={`text-2xl font-light mt-1 font-mono ${isSameDay(date, new Date()) ? 'text-[#00E0FF]' : 'text-gray-300'}`}>{date.getDate()}</div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-7 min-h-full">
                        {weekDates.map((date, i) => {
                            const dayEvents = filteredMeetings.filter(m => isSameDay(m.date, date));
                            return (
                                <div key={i} className="border-r border-[#333] last:border-r-0 min-h-[500px] p-2 space-y-2 relative group hover:bg-[#0a0a0a] transition-colors">
                                    {/* Mock time grid lines */}
                                    {Array.from({ length: 12 }).map((_, idx) => (
                                        <div key={idx} className="absolute w-full border-b border-[#333]/30 h-[50px] top-0 left-0 pointer-events-none" style={{ top: `${idx * 50}px` }} />
                                    ))}

                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`relative z-10 p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getEventTypeStyles(event.type)}`}
                                        >
                                            <div className="text-[10px] font-bold font-mono truncate uppercase">{event.title}</div>
                                            <div className="text-[9px] font-mono opacity-75">{event.startTime} - {event.endTime}</div>
                                        </div>
                                    ))}
                                    {dayEvents.length === 0 && (
                                        <div className="h-full flex items-center justify-center">
                                            <span className="text-[10px] text-gray-700 font-mono opacity-0 group-hover:opacity-100 uppercase">No Signal</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const dayEvents = filteredMeetings.filter(m => isSameDay(m.date, currentDate));
        return (
            <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-y-auto">
                <div className="p-8 max-w-4xl mx-auto w-full">
                    <div className="flex items-center mb-8 pb-4 border-b border-[#333]">
                        <div className="text-4xl font-light text-[#00E0FF] font-mono mr-4">{currentDate.getDate()}</div>
                        <div>
                            <div className="text-gray-400 uppercase font-bold text-sm font-mono tracking-widest">{currentDate.toLocaleDateString('default', { weekday: 'long' })}</div>
                            <div className="text-gray-600 text-sm font-mono">{currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {dayEvents.length > 0 ? (
                            dayEvents.map(event => (
                                <div key={event.id} onClick={() => setSelectedEvent(event)} className="flex group cursor-pointer">
                                    <div className="w-24 pt-2 text-right text-sm text-gray-500 font-mono mr-6">
                                        {event.startTime}
                                    </div>
                                    <div className={`flex-1 p-4 shadow-sm hover:shadow-md transition-all ${getEventTypeStyles(event.type)} hover:border-[#00E0FF]/50`}>
                                        <h3 className="font-bold text-lg mb-1 font-mono uppercase tracking-wide">{event.title}</h3>
                                        <div className="flex items-center text-xs opacity-75 mb-2 font-mono">
                                            <Clock className="w-3 h-3 mr-2" />
                                            {event.startTime} - {event.endTime}
                                        </div>
                                        {event.description && <p className="text-xs opacity-90 font-mono leading-relaxed">{event.description}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[#0a0a0a] rounded-xl border border-dashed border-[#333]">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-[#333]" />
                                <p className="text-gray-500 font-mono text-sm uppercase">NO SCHEDULED PROTOCOLS.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderListView = () => {
        // Sort all meetings by date
        const sortedMeetings = [...filteredMeetings].sort((a, b) => a.date - b.date);

        return (
            <div className="flex-1 bg-[#050505] overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-[#333] pb-2 font-mono uppercase tracking-widest">Agenda</h3>
                    {sortedMeetings.map((event, index) => {
                        const showDateHeader = index === 0 || !isSameDay(sortedMeetings[index - 1].date, event.date);
                        return (
                            <div key={event.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                {showDateHeader && (
                                    <div className="sticky top-0 bg-[#050505]/95 backdrop-blur py-2 z-10 mb-3 mt-6 first:mt-0 flex items-center border-b border-[#333]">
                                        <div className="w-2 h-2 bg-[#00E0FF] mr-3 shadow-[0_0_10px_#00E0FF]"></div>
                                        <h4 className="font-bold text-[#E0E0E0] font-mono uppercase tracking-wide">
                                            {event.date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h4>
                                    </div>
                                )}
                                <div onClick={() => setSelectedEvent(event)} className="ml-6 bg-[#0a0a0a] hover:bg-[#111] border border-[#333] hover:border-[#00E0FF]/40 rounded p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <span className="text-[10px] font-bold text-[#00E0FF] bg-[#00E0FF]/10 px-2 py-0.5 rounded font-mono border border-[#00E0FF]/20">{event.startTime}</span>
                                            <h4 className="font-bold text-gray-400 group-hover:text-[#00E0FF] transition-colors uppercase tracking-wide text-[10px] bg-[#1a1a1a] px-2 py-0.5 rounded ml-2 font-mono">{event.type}</h4>
                                            <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors ml-2 font-mono uppercase">{event.title}</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-[5.5rem] truncate max-w-md font-mono">{event.description || 'No description'}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#00E0FF] transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                    {sortedMeetings.length === 0 && (
                        <div className="text-center py-12 text-gray-600 font-mono text-sm uppercase">
                            No signals matching search criteria.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-[#00E0FF] font-mono animate-pulse">LOADING CALENDAR MATRIX...</div>;

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-gray-300">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20 transition-all">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => {
                            const now = new Date();
                            setCurrentDate(now);
                        }}
                        className="px-5 py-2 text-xs font-bold font-mono uppercase text-gray-400 bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222] hover:text-white hover:border-gray-500 active:scale-95 transition-all duration-200"
                    >
                        Today
                    </button>

                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (view === 'week' ? 7 : view === 'day' ? 1 : 30)))}
                            className="p-2 rounded-full hover:bg-[#1a1a1a] text-gray-500 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (view === 'week' ? 7 : view === 'day' ? 1 : 30)))}
                            className="p-2 rounded-full hover:bg-[#1a1a1a] text-gray-500 hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-white min-w-[200px] pl-2 font-mono tracking-wide uppercase">
                        {currentDate.toLocaleString('default', { month: 'long' })} <span className="text-[#00E0FF]">{currentDate.getFullYear()}</span>
                    </h2>
                </div>

                <div className="flex items-center space-x-3 pr-2">
                    {/* View Switcher */}
                    <div className="hidden md:flex items-center bg-[#0a0a0a] rounded border border-[#333] p-1 mr-4">
                        {['month', 'week', 'day', 'list'].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-3 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all ${view === v
                                    ? 'bg-[#00E0FF]/10 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.1)] border border-[#00E0FF]/30'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    {/* Search Actions */}
                    <div className="flex items-center space-x-2 border-l border-[#333] pl-4 relative">
                        {isSearchOpen ? (
                            <div className="w-64 animate-in slide-in-from-right-10 fade-in duration-200 relative">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="SEARCH PROTOCOLS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                    className="w-full pl-3 pr-8 py-1.5 text-xs font-mono bg-[#0a0a0a] border border-[#00E0FF]/50 text-white rounded shadow-sm outline-none focus:ring-1 focus:ring-[#00E0FF]"
                                />
                                <X
                                    className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white"
                                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                />
                            </div>
                        ) : (
                            <div className="relative group" onClick={() => setIsSearchOpen(true)}>
                                <Search className="w-5 h-5 text-gray-500 group-hover:text-[#00E0FF] transition-colors cursor-pointer" />
                            </div>
                        )}

                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
                {view === 'list' && renderListView()}
            </div>

            {/* Modals */}
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

export default Calendar;
