import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Trash2, UserPlus, Users, Activity, Clock } from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Add User State
    const [newEmpName, setNewEmpName] = useState('');
    const [newEmpPass, setNewEmpPass] = useState('');

    // Load Users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load users", err);
            setLoading(false);
        }
    };

    // Add User Handler
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await api.post('/admin/add-user', {
                username: newEmpName,
                password: newEmpPass,
                adminUsername: user.username
            });

            if (response.data) {
                setMessage(`✅ Success: Added ${newEmpName}`);
                setNewEmpName('');
                setNewEmpPass('');
                fetchUsers(); // Refresh list
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error(err);
            setError(`❌ Error: ${err.response?.data?.error || "Network Error"}`);
            setTimeout(() => setError(''), 3000);
        }
    };

    // Delete User Handler
    const handleDeleteUser = async (id, username) => {
        if (!window.confirm(`Are you sure you want to KICK OUT ${username}? They will not be able to login again.`)) return;

        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setMessage(`🚫 Kicked out ${username}`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to delete user");
        }
    };

    // Reset Modal State
    const [resetModalUser, setResetModalUser] = useState(null);
    const [resetPasswordValue, setResetPasswordValue] = useState('');

    // Open Modal
    const openResetModal = (targetUser) => {
        setResetModalUser(targetUser);
        setResetPasswordValue('');
    };

    // Execute Reset
    const handleExecuteReset = async (e) => {
        e.preventDefault();
        if (!resetModalUser) return;

        try {
            await api.post(`/admin/users/${resetModalUser.id}/reset-password`, {
                newPassword: resetPasswordValue
            });
            setMessage(`✅ Password for ${resetModalUser.username} updated!`);
            setResetModalUser(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to reset password");
            setTimeout(() => setError(''), 3000);
        }
    };

    // Security Guard
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white flex items-center">
                <Shield className="mr-3 h-8 w-8 text-indigo-600" />
                Admin Settings
            </h1>

            {/* --- ADD EMPLOYEE SECTION --- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <UserPlus className="mr-2 h-5 w-5 text-green-500" />
                    Add New Employee
                </h3>

                <form onSubmit={handleAddEmployee} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            value={newEmpName}
                            onChange={(e) => setNewEmpName(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Ahmed"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="text"
                            value={newEmpPass}
                            onChange={(e) => setNewEmpPass(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. pass123"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-sm w-full md:w-auto">
                        + Add User
                    </button>
                </form>

                {/* Feedback Messages */}
                {message && <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium">{message}</div>}
                {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md font-medium">{error}</div>}
            </div>

            {/* --- EMPLOYEE LIST SECTION --- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                        <Users className="mr-2 h-5 w-5 text-indigo-500" />
                        Team Management
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {users.length} Active Users
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold mr-3">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Activity className="h-3 w-3 mr-1" />
                                            {u.records_count || 0} Records
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {u.id !== user.id && (
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => openResetModal(u)}
                                                    className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-400 flex items-center"
                                                    title="Reset Password"
                                                >
                                                    <Shield className="h-4 w-4 mr-1" />
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400 flex items-center"
                                                    title="Kick Out User"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Kick Out
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RESET PASSWORD MODAL */}
            {resetModalUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background Overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setResetModalUser(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleExecuteReset}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <Shield className="h-6 w-6 text-amber-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                                Reset Password for <strong>{resetModalUser.username}</strong>
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    Enter a new password for this user immediately.
                                                </p>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                    placeholder="Enter new password"
                                                    value={resetPasswordValue}
                                                    onChange={(e) => setResetPasswordValue(e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save New Password
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setResetModalUser(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
