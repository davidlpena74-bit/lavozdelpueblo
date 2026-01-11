
import { supabase } from './supabase';
import { Topic, RegionCode, OccupationType, GenderType, Comment } from '../../types';

// Map database row to app Topic type
const mapTopic = (row: any): Topic => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    createdAt: new Date(row.created_at).getTime(),
    votes: {
        support: row.support_count || 0,
        oppose: row.oppose_count || 0,
        neutral: row.neutral_count || 0,
    },
    regionalVotes: row.regionalVotes || {},
    pros: row.pros || [],
    cons: row.cons || [],
    aiAnalysis: row.ai_analysis,
    hasVoted: row.hasVoted, // from view matches strict alias
    labelSupport: row.label_support,
    labelOppose: row.label_oppose
});

export const api = {
    // COMMENTS
    async fetchComments(topicId: string) {
        // 1. Fetch comments with total votes (public view)
        const { data: comments, error } = await supabase
            .from('comments_with_votes')
            .select('*')
            .eq('topic_id', topicId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. Fetch current user's votes on these comments (if logged in)
        const { data: { session } } = await supabase.auth.getSession();
        let userVotesMap: Record<string, 'up' | 'down'> = {};

        if (session?.user) {
            const commentIds = comments.map(c => c.id);
            if (commentIds.length > 0) {
                const { data: myVotes } = await supabase
                    .from('comment_votes')
                    .select('comment_id, vote_type')
                    .eq('user_id', session.user.id)
                    .in('comment_id', commentIds);

                myVotes?.forEach((v: any) => {
                    userVotesMap[v.comment_id] = v.vote_type;
                });
            }
        }

        // 3. Transform to application objects and build Tree structure
        const rawList = comments.map((row: any) => {
            let extractedName = 'Ciudadano ' + row.user_id.slice(0, 4);
            const avatarUrl = row.avatar_url;

            if (avatarUrl && avatarUrl.includes('seed=')) {
                try {
                    const seed = avatarUrl.split('seed=')[1];
                    const fullName = decodeURIComponent(seed).replace(/\+/g, ' ');

                    const parts = fullName.split(' ');
                    if (parts.length > 0) {
                        const firstName = parts[0];
                        let suffix = '';
                        if (parts.length > 1) {
                            suffix = parts.slice(1).map(p => p[0]).join('').toUpperCase();
                        }
                        let hash = 0;
                        for (let i = 0; i < row.user_id.length; i++) {
                            hash = row.user_id.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const num = Math.abs(hash % 100);
                        extractedName = `${firstName}${suffix}_${num}`;
                    }
                } catch (e) { }
            }

            return {
                id: row.id,
                topicId: topicId,
                userId: row.user_id,
                userName: extractedName,
                avatar: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id}`,
                content: row.content,
                region: row.region,
                createdAt: new Date(row.created_at).getTime() > 0 ? new Date(row.created_at).toLocaleDateString() : 'Hoy',
                isFake: row.is_fake,
                upvotes: row.upvotes || 0,
                downvotes: row.downvotes || 0,
                userVote: userVotesMap[row.id] || null,
                parentId: row.parent_id,
                replies: []
            } as Comment;
        });

        // Build Tree
        const commentMap: Record<string, Comment> = {};
        rawList.forEach(c => commentMap[c.id] = c);

        const rootComments: Comment[] = [];
        rawList.forEach(c => {
            if (c.parentId && commentMap[c.parentId]) {
                commentMap[c.parentId].replies?.push(c);
            } else {
                rootComments.push(c);
            }
        });

        // Sort roots (newest first)
        rootComments.sort((a, b) => {
            // Parse dates back to sort?? Or just trust DB order.
            // Since we use 'Today' string... we better use original DB sort which is DESC.
            // But replies usually are ASC (oldest first).
            return 0; // Keeping DB order
        });

        // Sort replies (Usually Oldest First for conversation flow)
        const sortReplies = (list: Comment[]) => {
            list.sort((a, b) => a.id.localeCompare(b.id)); // Simple sort by ID (approx time) or keep DB order
            list.forEach(c => {
                if (c.replies && c.replies.length > 0) sortReplies(c.replies);
            });
        };
        rootComments.forEach(c => {
            if (c.replies) c.replies.reverse(); // DB gave us DESC. Replies usually want ASC (Oldest on top).
        });

        return rootComments;
    },

    async voteComment(commentId: string, voteType: 'up' | 'down') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Must be logged in");

        // Check if vote exists
        const { data: existingVote } = await supabase
            .from('comment_votes')
            .select('*')
            .eq('comment_id', commentId)
            .eq('user_id', user.id)
            .single();

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                // Toggle OFF (delete)
                await supabase.from('comment_votes').delete().eq('comment_id', commentId).eq('user_id', user.id);
                return null; // Removed
            } else {
                // Update (switch side)
                await supabase.from('comment_votes').update({ vote_type: voteType }).eq('comment_id', commentId).eq('user_id', user.id);
                return voteType;
            }
        } else {
            // Insert
            await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: user.id, vote_type: voteType });
            return voteType;
        }
    },

    async postComment(topicId: string, content: string, userId: string, parentId?: string) {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                topic_id: topicId,
                user_id: userId,
                content: content,
                parent_id: parentId // Optional
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // TOPICS
    // Fetch all topics with stats, optionally filtered by category
    async fetchTopics(category?: string) {
        let query = supabase
            .from('topics_with_stats')
            .select('*')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data.map(mapTopic);
    },

    // Create a new topic
    async createTopic(topic: Omit<Topic, 'id' | 'votes' | 'regionalVotes' | 'createdAt'>) {
        const { data, error } = await supabase
            .from('topics')
            .insert({
                title: topic.title,
                category: topic.category,
                description: topic.description,
                pros: topic.pros,
                cons: topic.cons,
                ai_analysis: topic.aiAnalysis,
                label_support: topic.labelSupport,
                label_oppose: topic.labelOppose
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Cast a vote
    async castVote(topicId: string, choice: 'support' | 'oppose' | 'neutral', region: RegionCode) {
        // ... (existing code)
        // 2. Insert vote
        const { error } = await supabase
            .from('votes')
            .insert({
                topic_id: topicId,
                choice,
                region
            });

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Ya has votado en este tema.');
            }
            throw error;
        }

        return true;
    },

    // Fetch votes for a specific user
    async fetchUserVotes(userId: string) {
        const { data, error } = await supabase
            .from('votes')
            .select(`
                *,
                topic:topics (title, category)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },
    // Update user profile fields (region, dni, avatar, etc.)
    async updateUserProfile(userId: string, updates: {
        region?: RegionCode;
        dni?: string;
        avatar_url?: string;
        age?: number;
        occupation?: OccupationType;
        gender?: GenderType;
    }) {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return true;
    },
    // Get total user count
    async fetchUserCount() {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count || 0;
    },
};
