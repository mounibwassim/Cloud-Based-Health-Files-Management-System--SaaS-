import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Activity, Baby, Eye, FileText, Loader, ArrowLeft } from 'lucide-react';

const FILE_TYPES = [
    { id: 'surgery', name: 'Surgery', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'ivf', name: 'IVF (In Vitro Fertilization)', icon: Baby, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'eye', name: 'Ophthalmology (Eye)', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'labs', name: 'Radiology & Labs', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function StateDetail() {
    const { id } = useParams();
    const [state, setState] = useState(null);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Frontend attempting to fetch ID:', id);
        // Parallel fetch: State Details + Counts
        const fetchData = async () => {
            try {
                const [stateRes, countsRes] = await Promise.all([
                    api.get(`/states/${id}`),
                    api.get(`/states/${id}/counts`)
                ]);
                setState(stateRes.data);
                setCounts(countsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch state data", err);
                // Capture exact error message from backend if available
                const msg = err.response?.data?.error || err.message;
                setError(msg);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-indigo-500" /></div>;

    if (error) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl text-red-600 font-bold mb-2">Error Loading State</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Check console for details.</p>
            <Link to="/" className="text-indigo-600 underline mt-4 inline-block">Go Back</Link>
        </div>
    );

    if (!state) return <div className="p-10 text-center text-red-500">State not found (No Data)</div>;

    return (
        <div className="px-4 py-6 animate-in fade-in duration-300">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to States
                </Link>
                <div className="flex items-baseline mt-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span className="text-indigo-600 dark:text-indigo-400 mr-3">{state.code}</span>
                        {state.name}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FILE_TYPES.map(type => {
                    const Icon = type.icon;
                    // Map file types slightly if names differ in DB vs IDs here
                    // Our DB has names like 'surgery', 'ivf', 'eye', 'labs' which match IDs here.
                    // If DB display_name differs, we rely on the ID match.
                    // The counts object keys come from 'f.name' in SQL, which is 'surgery', 'ivf'...
                    const count = counts[type.id] || 0;

                    return (
                        <Link
                            key={type.id}
                            to={`/states/${state.code}/files/${type.id}/records`}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all h-64 relative overflow-hidden"
                        >
                            {/* Badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${count > 0 ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                {count} records
                            </div>

                            <div className={`p-4 rounded-full mb-4 ${type.bg} dark:bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`w-12 h-12 ${type.color}`} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{type.name}</h2>
                            <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Open File &rarr;</div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
