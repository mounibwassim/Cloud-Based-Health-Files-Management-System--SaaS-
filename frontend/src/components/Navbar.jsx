import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User, Edit2, Check, HeartPulse } from 'lucide-react';

export default function Navbar() {
    // Theme State
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // Profile State
    const [managerName, setManagerName] = useState(() => {
        return localStorage.getItem('managerName') || 'Manager';
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(managerName);

    // Apply Theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Handle Profile Update
    const saveName = () => {
        setManagerName(tempName);
        localStorage.setItem('managerName', tempName);
        setIsEditingName(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo & Title */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                            <HeartPulse className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                            HealthFiles <span className="text-indigo-600 dark:text-indigo-400">DZ</span>
                        </span>
                    </Link>

                    {/* Right Section: Profile & Theme */}
                    <div className="flex items-center space-x-6">

                        {/* Manager Profile */}
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
                            <div className="bg-indigo-100 dark:bg-indigo-900 p-1 rounded-full">
                                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                            </div>

                            {isEditingName ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-24 text-sm bg-white dark:bg-gray-600 border border-indigo-300 rounded px-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                                        autoFocus
                                    />
                                    <button onClick={saveName} className="ml-2 text-green-600 hover:text-green-700">
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center group cursor-pointer" onClick={() => { setTempName(managerName); setIsEditingName(true); }}>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2 max-w-[100px] truncate">
                                        {managerName}
                                    </span>
                                    <Edit2 className="h-3 w-3 text-gray-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                    </div>
                </div>
            </div>
        </nav>
    );
}
