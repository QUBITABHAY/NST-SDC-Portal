import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { registerUser } from '../api/auth'; // Assuming this exists or I need to create it

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("PASSWORDS DO NOT MATCH");
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement registerUser API call
            // await registerUser(formData);

            // For now, simulate success or show error that backend needs implementation
            // alert("Registration logic to be implemented on backend/frontend-api linkage.");
            // navigate('/login');

            // Placeholder error until API is ready
            setError("REGISTRATION MODULE OFFLINE. CONTACT ADMIN.");

        } catch (err) {
            console.error("Registration failed:", err);
            setError("REGISTRATION FAILED. TRY AGAIN.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E0FF] rounded-full blur-[120px]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00E0FF] rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md glass-panel p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] relative z-10 border border-[#333]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#1f1f1f] rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#00E0FF]/30 shadow-[0_0_15px_rgba(0,224,255,0.2)]">
                        <span className="text-[#00E0FF] font-bold font-mono text-3xl">{`<>`}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-[#E0E0E0] font-mono tracking-wider">NEW USER</h2>
                    <p className="text-gray-500 text-sm mt-2 font-mono uppercase">Initialize Access Protocols</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded mb-6 text-sm font-mono flex items-center gap-2">
                        <span className="text-lg">!</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#00E0FF] text-xs font-bold mb-2 font-mono tracking-widest uppercase" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] text-[#E0E0E0] rounded focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all font-mono"
                            placeholder="usr_new_id"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#00E0FF] text-xs font-bold mb-2 font-mono tracking-widest uppercase" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] text-[#E0E0E0] rounded focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all font-mono"
                            placeholder="user@domain.com"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#00E0FF] text-xs font-bold mb-2 font-mono tracking-widest uppercase" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] text-[#E0E0E0] rounded focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[#00E0FF] text-xs font-bold mb-2 font-mono tracking-widest uppercase" htmlFor="confirmPassword">
                                Confirm
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] text-[#E0E0E0] rounded focus:outline-none focus:border-[#00E0FF] focus:shadow-[0_0_10px_rgba(0,224,255,0.1)] transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/50 font-bold py-3 px-4 rounded hover:bg-[#00E0FF] hover:text-[#050505] transition-all duration-300 font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(0,224,255,0.1)] mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'PROCESSING...' : '> INITIALIZE REGISTRATION'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs font-mono">ALREADY HAVE ACCESS? <Link to="/login" className="text-[#00E0FF] hover:underline">LOGIN HERE</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
