import api from './axios';

export const getLeaderboard = async (period = 'all_time') => {
    const response = await api.get(`leaderboard/?period=${period}&limit=50`);
    return response.data;
};
