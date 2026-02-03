import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Edit, Trash2, Plus, Calendar, MapPin, Users } from 'lucide-react';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [users, setUsers] = useState([]); // For attendance marking

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'meetup',
        event_date: '',
        location: '',
        meeting_link: ''
    });

    const [attendanceData, setAttendanceData] = useState({
        user_id: '',
        status: 'present'
    });

    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/events/');
            setEvents(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setFormData({
            title: '',
            description: '',
            event_type: 'meetup',
            event_date: '',
            location: '',
            meeting_link: ''
        });
        setIsEventModalOpen(true);
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            event_type: event.event_type,
            event_date: event.event_date.slice(0, 16), // Format for datetime-local
            location: event.location,
            meeting_link: event.meeting_link
        });
        setIsEventModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/events/${id}/`);
            fetchEvents();
        } catch (error) {
            alert("Failed to delete event");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEvent) {
                await api.patch(`/events/${selectedEvent.id}/`, formData);
            } else {
                await api.post('/events/', formData);
            }
            setIsEventModalOpen(false);
            fetchEvents();
        } catch (error) {
            alert("Operation failed");
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEvent) return;

        try {
            await api.post('/attendance/', {
                event: selectedEvent.id,
                user: attendanceData.user_id,
                status: attendanceData.status
            });
            alert("Attendance marked");
            // Optional: reset user selection
        } catch (error) {
            alert("Failed to mark attendance (already marked?)");
        }
    };

    return (
        <div className="font-mono">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wider">
                    <span className="text-[#00E0FF]">{`>`}</span> EVENT_LOGS
                </h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 px-4 py-2 rounded hover:bg-[#00E0FF]/20 hover:shadow-[0_0_15px_rgba(0,224,255,0.2)] transition-all font-bold tracking-wider text-sm"
                >
                    <Plus size={16} /> INITIALIZE_EVENT
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-[#00E0FF] animate-pulse">Scanning Event Protocols...</div>
            ) : (
                <div className="grid gap-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-[#050505] border border-[#333] rounded-lg p-4 flex justify-between items-center hover:border-[#00E0FF]/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,224,255,0.05)]">
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-[#00E0FF] transition-colors tracking-wide uppercase">{event.title}</h3>
                                <div className="text-xs text-gray-500 flex gap-4 mt-2 font-mono">
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        <Calendar size={12} className="text-[#00E0FF]" />
                                        {new Date(event.event_date).toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        <MapPin size={12} className="text-[#00E0FF]" />
                                        {event.location}
                                    </span>
                                    <span className={`capitalize px-2 py-0.5 rounded text-[10px] border tracking-wider font-bold
                                        ${event.event_type === 'hackathon' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                            event.event_type === 'workshop' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                        {event.event_type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setIsAttendanceModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded border border-green-500/30 transition-all uppercase tracking-wider"
                                >
                                    <Users size={14} /> Attendance
                                </button>
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-1.5 text-[#00E0FF] hover:bg-[#00E0FF]/10 rounded border border-transparent hover:border-[#00E0FF]/30 transition-all"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEventModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-xl border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                                {selectedEvent ? 'Update Protocol' : 'New Event Protocol'}
                            </h2>
                            <button onClick={() => setIsEventModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Event Designation</label>
                                <input
                                    type="text" placeholder="Title" value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all" required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Mission Briefing</label>
                                <textarea
                                    placeholder="Description" value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] h-24 transition-all" required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Category</label>
                                    <select
                                        value={formData.event_type}
                                        onChange={e => setFormData({ ...formData, event_type: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    >
                                        <option value="meetup">Meetup</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="webinar">Webinar</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Execution Time</label>
                                    <input
                                        type="datetime-local" value={formData.event_date}
                                        onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                                        className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all [color-scheme:dark]" required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Coordinates / Location</label>
                                <input
                                    type="text" placeholder="Location" value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all" required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Uplink URL</label>
                                <input
                                    type="url" placeholder="Meeting Link (Optional)" value={formData.meeting_link}
                                    onChange={e => setFormData({ ...formData, meeting_link: e.target.value })}
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded transition-all text-sm font-bold uppercase tracking-wider">Abort</button>
                                <button type="submit" className="px-6 py-2 bg-[#00E0FF] text-black font-bold rounded shadow-[0_0_15px_rgba(0,224,255,0.4)] hover:bg-[#33eaff] hover:shadow-[0_0_25px_rgba(0,224,255,0.6)] transition-all text-sm uppercase tracking-wider">Confirm Protocol</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAttendanceModalOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-xl border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#333] bg-[#111]">
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase">User Presence Log</h2>
                            <p className="text-xs text-gray-500 font-mono mt-1">FOR: {selectedEvent.title}</p>
                        </div>
                        <form onSubmit={handleMarkAttendance} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Target Agent</label>
                                <select
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    value={attendanceData.user_id}
                                    onChange={e => setAttendanceData({ ...attendanceData, user_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Agent --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                                <select
                                    className="w-full p-2.5 bg-[#050505] border border-[#333] rounded text-white focus:outline-none focus:border-[#00E0FF] transition-all"
                                    value={attendanceData.status}
                                    onChange={e => setAttendanceData({ ...attendanceData, status: e.target.value })}
                                >
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="excused">Excused</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#333]">
                                <button type="button" onClick={() => setIsAttendanceModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded transition-all text-sm font-bold uppercase tracking-wider">Close</button>
                                <button type="submit" className="px-6 py-2 bg-green-500 text-black font-bold rounded shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-all text-sm uppercase tracking-wider">Update Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;
