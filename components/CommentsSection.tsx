
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

// Recursively render comments
const CommentItem: React.FC<{
    comment: Comment;
    user: any;
    onRequireAuth: () => void;
    onVote: (id: string, type: 'up' | 'down') => void;
    onReply: (parentId: string, content: string) => Promise<void>;
    depth?: number;
}> = ({ comment, user, onRequireAuth, onVote, onReply, depth = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        setSubmitting(true);
        try {
            await onReply(comment.id, replyContent);
            setIsReplying(false);
            setReplyContent('');
        } finally {
            setSubmitting(false);
        }
    };

    const maxDepth = 5; // Prevent infinite nesting UI issues

    return (
        <div className={`flex flex-col gap-4 ${depth > 0 ? 'mt-4' : ''}`}>
            <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                    <img src={comment.avatar} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" alt={comment.userName} />
                </div>
                <div className="flex-grow">
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-baseline mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm">{comment.userName}</span>
                                {comment.region && (
                                    <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">{comment.region}</span>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(parseInt(comment.createdAt) || Date.now(), { addSuffix: true, locale: es })}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                        {/* Action Bar */}
                        <div className="flex items-center mt-3 gap-4">
                            <button
                                onClick={() => onVote(comment.id, 'up')}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.userVote === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
                            >
                                <svg className="w-4 h-4" fill={comment.userVote === 'up' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                                {comment.upvotes || 0}
                            </button>
                            <button
                                onClick={() => onVote(comment.id, 'down')}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.userVote === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <svg className="w-4 h-4" fill={comment.userVote === 'down' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                                {comment.downvotes || 0}
                            </button>

                            {/* Reply Button */}
                            {depth < maxDepth && (
                                <button
                                    onClick={() => user ? setIsReplying(!isReplying) : onRequireAuth()}
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors ml-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Responder
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-4 flex gap-3 animate-fade-in pl-4 border-l-2 border-indigo-100">
                            <img src={user.avatar} className="w-8 h-8 rounded-full" alt="Tu avatar" />
                            <div className="flex-grow">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Respondiendo a ${comment.userName}...`}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(false)}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !replyContent.trim()}
                                        className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {submitting ? 'Enviando...' : 'Responder'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Recursively render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-12 border-l-2 border-gray-100 ml-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            user={user}
                            onRequireAuth={onRequireAuth}
                            onVote={onVote}
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


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
            // Partial reload or optimistic update could be better, but full reload is safer for trees
            await loadComments();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Error al publicar comentario');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        if (!user) return;
        await api.postComment(topicId, content, user.id, parentId);
        await loadComments();
    };

    const handleVote = async (commentId: string, type: 'up' | 'down') => {
        if (!user) {
            onRequireAuth();
            return;
        }

        // Helper to update tree deeply
        const updateTree = (list: Comment[]): Comment[] => {
            return list.map(c => {
                if (c.id === commentId) {
                    const oldVote = c.userVote;
                    let newUpvotes = c.upvotes || 0;
                    let newDownvotes = c.downvotes || 0;
                    if (oldVote === 'up') newUpvotes--;
                    if (oldVote === 'down') newDownvotes--;
                    const newVote = (oldVote === type) ? null : type;
                    if (newVote === 'up') newUpvotes++;
                    if (newVote === 'down') newDownvotes++;
                    return { ...c, userVote: newVote, upvotes: newUpvotes, downvotes: newDownvotes };
                }
                if (c.replies) {
                    return { ...c, replies: updateTree(c.replies) };
                }
                return c;
            });
        };

        setComments(current => updateTree(current));

        try {
            await api.voteComment(commentId, type);
        } catch (err) {
            console.error(err);
            loadComments();
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                Debate Ciudadano
            </h3>

            {/* Main Input */}
            <div className="mb-10">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" alt="Tu avatar" />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Inicia un nuevo hilo de debate..."
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
                                {submitting ? 'Publicando...' : 'Publicar Nuevo Hilo'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-200">
                        <p className="text-slate-600 mb-3">Inicia sesión para participar en el debate.</p>
                        <button onClick={onRequireAuth} className="text-indigo-600 font-bold hover:underline">
                            Iniciar sesión ahora
                        </button>
                    </div>
                )}
            </div>

            {/* Threaded List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Cargando debate...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic">
                        Aún no hay comentarios. ¡Sé el primero en opinar!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            user={user}
                            onRequireAuth={onRequireAuth}
                            onVote={handleVote}
                            onReply={handleReply}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
