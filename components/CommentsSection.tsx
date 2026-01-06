
import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';
import { Comment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentsSectionProps {
    topicId: string;
    user: any;
    onRequireAuth: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ topicId, user, onRequireAuth }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadComments = async () => {
        try {
            const data = await api.fetchComments(topicId);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [topicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            onRequireAuth();
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.postComment(topicId, newComment, user.id);
            setNewComment('');
            await loadComments(); // Reload to see new comment
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error al publicar comentario');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                Debate Ciudadano ({comments.length})
            </h3>

            {/* Input Area */}
            <div className="mb-10">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" alt="Tu avatar" />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Comparte tu opinión con respeto..."
                                className="flex-grow p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y"
                                disabled={submitting}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !newComment.trim()}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-200"
                            >
                                {submitting ? 'Publicando...' : 'Publicar Comentario'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-200">
                        <p className="text-slate-600 mb-3">Inicia sesión para participar en el debate.</p>
                        <button
                            onClick={onRequireAuth}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Iniciar sesión ahora
                        </button>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Cargando comentarios...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic">
                        Aún no hay comentarios. ¡Sé el primero en opinar!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="flex-shrink-0">
                                <img src={comment.userAvatar} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" alt={comment.userName} />
                            </div>
                            <div className="flex-grow">
                                <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="font-bold text-gray-900 text-sm">{comment.userName}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: es })}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
