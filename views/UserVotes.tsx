
import React, { useEffect, useState } from 'react';
import { api } from '../src/services/api';
import { Link } from 'react-router-dom';

interface VoteHistoryItem {
    id: string;
    topic_id: string;
    choice: 'support' | 'oppose' | 'neutral';
    region: string;
    created_at: string;
    topic: {
        title: string;
        category: string;
    };
}

const UserVotes: React.FC<{ userId: string }> = ({ userId }) => {
    const [votes, setVotes] = useState<VoteHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVotes = async () => {
            try {
                const data = await api.fetchUserVotes(userId);
                setVotes(data);
            } catch (err) {
                console.error('Error loading votes:', err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) loadVotes();
    }, [userId]);

    const getChoiceLabel = (choice: string) => {
        switch (choice) {
            case 'support': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">A Favor</span>;
            case 'oppose': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">En Contra</span>;
            default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Neutral</span>;
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando historial...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Votos</h2>

            {votes.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aún no has votado en ningún tema.</p>
                    <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">Ir a votar &rarr;</Link>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {votes.map((vote) => (
                            <li key={vote.id}>
                                <Link to={`/topic/${vote.topic_id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{vote.topic.title}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                {getChoiceLabel(vote.choice)}
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {vote.topic.category}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    Votado el {new Date(vote.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserVotes;
