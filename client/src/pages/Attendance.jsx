import { useEffect, useState } from 'react';
import { getMyAttendance, getPastEvents } from '../api/attendance';
import { CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
    const [attended, setAttended] = useState([]);
    const [missed, setMissed] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ALL attendance and PAST MEETUPS
                const [attendanceData, pastEventsData] = await Promise.all([
                    getMyAttendance(),
                    getPastEvents('meetup') // Only fetch past meetups
                ]);

                // Filter attendance to ONLY include meetups
                // We need to know the event type of the attendance records.
                // Assuming the serializer includes the full event object or at least the type.
                // Let's verify via the passed event object in attendanceData.

                // Filter "My Attendance" to only keep records where event_type is 'meetup'
                // Note: The backend AttendanceSerializer nests the 'event' object. 
                // We must ensure the 'event' object has 'event_type'. 
                // Based on previous ViewFile of serializers.py (not fully shown but implied standard serializer), 
                // or we can just filter by matching IDs with pastEventsData (which are guaranteed meetups).

                // BUT, pastEventsData only has PAST meetups. attendanceData might have FUTURE meetups (though unlikely to have marked attendance).
                // Safe bet: Filter attendanceData where event.event_type === 'meetup'

                const meetupAttendance = attendanceData.filter(record => record.event.event_type === 'meetup');

                // Map attended meetup IDs
                const attendedEventIds = new Set(meetupAttendance.map(record => record.event.id));

                // Separate missed meetings (From the past 'meetup' list, exclude those attended)
                const missedEventsList = pastEventsData.filter(event => !attendedEventIds.has(event.id));

                setAttended(meetupAttendance);
                setMissed(missedEventsList);

                // Calculate percentage based on MEETUPS only
                const totalPastMeetups = pastEventsData.length;

                // Note: If I attended a meeting that is NOT in pastEventsData (e.g. somehow marked in future?), 
                // it shouldn't count towards the 'past' percentage ideally.
                // Converting logic: Percentage = (Attended Past Meetups / Total Past Meetups) * 100

                // Let's refine: Filter 'meetupAttendance' to also be 'past'?
                // Generally attendance is only marked for past/current events.
                // We will use the count of 'meetupAttendance' that match 'pastEventsData' IDs + missedEvents? 
                // actually totalPastMeetups is the denominator.
                // Numerator should be (totalPastMeetups - missedEventsList.length) or (attendedEventIds intersect pastEventsData)

                // Let's trust 'meetupAttendance' count, but capped at total? 
                // Simplest: 
                // Attended = meetupAttendance
                // Total = pastEventsData (which are all past meetups)
                // Wait, if I attended a meetup, it MUST be in pastEventsData (unless it's today/future). 
                // Let's assume we care about "Attendance Rate for Past Meetings".

                // Correct logic: 
                // Denominator = Total Past Meetings (pastEventsData.length)
                // Numerator = Number of Past Meetings Attended (meetupAttendance.filter(r => new Date(r.event.event_date) < now))
                // For simplicity, let's use the intersection.

                const pastMeetupIds = new Set(pastEventsData.map(e => e.id));
                const attendedPastMeetupsCount = meetupAttendance.filter(r => pastMeetupIds.has(r.event.id)).length;

                if (totalPastMeetups > 0) {
                    setPercentage(Math.round((attendedPastMeetupsCount / totalPastMeetups) * 100));
                } else {
                    setPercentage(0);
                }

            } catch (err) {
                console.error("Failed to fetch attendance data:", err);
                setError("Failed to load attendance records.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const totalEvents = attended.length + missed.length;

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-full">
            <h1 className="text-3xl font-bold font-mono tracking-wider flex items-center gap-3 text-white mb-8">
                <span className="text-[#00E0FF] text-4xl">{`>`}</span>
                ATTENDANCE LOG
            </h1>

            {/* Stats Card */}
            <div className="glass-panel p-8 rounded-xl border border-[#333] mb-8 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#00E0FF] rounded-full blur-[150px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-[#E0E0E0] font-mono tracking-wide uppercase">Total Sync Rate</h2>
                    <p className="text-sm text-gray-400 font-mono mt-1">BASED ON PAST PROTOCOLS (MEETUPS)</p>
                </div>
                <div className="text-right relative z-10">
                    <span className={`text-6xl font-bold font-mono tracking-tighter text-shadow-neon ${totalEvents === 0 ? 'text-gray-600' : percentage >= 75 ? 'text-green-400' :
                        percentage >= 50 ? 'text-yellow-400' : 'text-red-500'
                        }`}>
                        {totalEvents > 0 ? `${percentage}%` : 'N/A'}
                    </span>
                    <div className="text-xs text-[#00E0FF] font-mono mt-2 uppercase tracking-widest border-t border-[#333] pt-2">
                        {attended.length} SYNCED / {attended.length + missed.length} TOTAL
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attended Section */}
                <div>
                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-3 font-mono tracking-widest uppercase">
                        <CheckCircle className="text-green-400" /> Synced Events
                    </h2>
                    <div className="space-y-4">
                        {attended.length === 0 && (
                            <div className="p-6 bg-[#1a1a1a] border border-dashed border-[#333] rounded-lg text-gray-500 text-center font-mono text-sm">NO SUCCESSFUL SYNCS LOGGED.</div>
                        )}
                        {attended.map((record) => (
                            <div key={record.id} className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-green-900/30 flex justify-between items-center transition-all hover:bg-[#1a1a1a] hover:border-green-500/50 group">
                                <div>
                                    <h3 className="font-bold text-gray-200 group-hover:text-green-400 transition-colors font-mono">{record.event.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{new Date(record.event.event_date).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold rounded font-mono uppercase tracking-wider">
                                    Confirmed
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Missed Section */}
                <div>
                    <h2 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-3 font-mono tracking-widest uppercase">
                        <XCircle className="text-red-500" /> Desync Events
                    </h2>
                    <div className="space-y-4">
                        {missed.length === 0 && (
                            <div className="p-6 bg-[#1a1a1a] border border-dashed border-[#333] rounded-lg text-gray-500 text-center font-mono text-sm">OPTIMAL SYNC RATE ACHIEVED. NO DESYNCS.</div>
                        )}
                        {missed.map((event) => (
                            <div key={event.id} className="bg-[#1a1a1a]/50 p-4 rounded-lg border border-red-900/30 flex justify-between items-center transition-all hover:bg-[#1a1a1a] hover:border-red-500/50 group">
                                <div>
                                    <h3 className="font-bold text-gray-200 group-hover:text-red-500 transition-colors font-mono">{event.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{new Date(event.event_date).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded font-mono uppercase tracking-wider">
                                    Absent
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
