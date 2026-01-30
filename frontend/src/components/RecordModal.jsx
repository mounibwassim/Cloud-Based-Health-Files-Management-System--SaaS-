import { useState, useEffect } from 'react';
import { X, Save, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';

export default function RecordModal({ isOpen, onClose, record, stateId, fileType, onSave }) {
    const [formData, setFormData] = useState({
        employeeName: '',
        postalAccount: '',
        amount: '',
        treatmentDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        status: 'completed',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (record) {
            // Edit mode
            const date = new Date(record.treatment_date);
            // Format to YYYY-MM-DD for input
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');

            setFormData({
                employeeName: record.employee_name,
                postalAccount: record.postal_account || '',
                amount: record.amount,
                treatmentDate: `${yyyy}-${mm}-${dd}`,
                status: record.status || 'completed',
                notes: record.notes || ''
            });
        } else {
            // Reset for add mode
            setFormData({
                employeeName: '',
                postalAccount: '',
                amount: '',
                treatmentDate: new Date().toISOString().split('T')[0],
                status: 'completed',
                notes: ''
            });
        }
        setError(null);
    }, [record, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                stateId,
                fileType,
                treatmentDate: new Date(formData.treatmentDate).toISOString(),
                // Explicitly ensure status is set
                status: formData.status,
                // Logic: If completed, note is irrelevant/cleared.
                notes: formData.status === 'completed' ? '' : formData.notes
            };

            console.log('Sending Payload:', payload);

            if (record) {
                await api.put(`/records/${record.id}`, payload);
            } else {
                await api.post('/records', payload);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to save record. Please check inputs.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{record ? 'Edit Record' : 'Add New Record'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.employeeName}
                                onChange={e => setFormData({ ...formData, employeeName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Account (CCP)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={formData.postalAccount}
                                    onChange={e => setFormData({ ...formData, postalAccount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (DZD) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Treatment Date *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.treatmentDate}
                                onChange={e => setFormData({ ...formData, treatmentDate: e.target.value })}
                            />
                        </div>

                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                            <div className="flex space-x-4">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-1/2 ${formData.status === 'completed' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="completed"
                                        checked={formData.status === 'completed'}
                                        onChange={() => setFormData({ ...formData, status: 'completed' })}
                                        className="sr-only"
                                    />
                                    <CheckCircle className={`w-5 h-5 mr-2 ${formData.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${formData.status === 'completed' ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'}`}>Completed</span>
                                </label>

                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-1/2 ${formData.status === 'incomplete' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="incomplete"
                                        checked={formData.status === 'incomplete'}
                                        onChange={() => setFormData({ ...formData, status: 'incomplete' })}
                                        className="sr-only"
                                    />
                                    <AlertCircle className={`w-5 h-5 mr-2 ${formData.status === 'incomplete' ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${formData.status === 'incomplete' ? 'text-red-800 dark:text-red-200' : 'text-gray-600 dark:text-gray-400'}`}>Incomplete</span>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Notes */}
                        {formData.status === 'incomplete' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Reason for Incompletion / Missing Documents *</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50 dark:bg-red-900/10 text-gray-900 dark:text-white"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Please describe why this is incomplete..."
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
