import { X, FileText, CheckCircle, AlertCircle, List } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Export Scope
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                        Please select which records you would like to include in the PDF report.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => onConfirm('completed')}
                            className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 transition-all group"
                        >
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Complete Only</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Records marked as completed</span>
                            </div>
                        </button>

                        <button
                            onClick={() => onConfirm('incomplete')}
                            className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all group"
                        >
                            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-300">Incomplete Only</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Pending or missing information</span>
                            </div>
                        </button>

                        <button
                            onClick={() => onConfirm('all')}
                            className="w-full flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
                        >
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4 group-hover:scale-110 transition-transform">
                                <List className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">All Records</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Everything in the database</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
