
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
        const { data, error } = await supabase
            .from('comments')
            .select(`
                id,
                content,
                created_at,
                user_id,
                profiles:user_id (
                    region,
                    avatar_url
                 )
            `)
            .eq('topic_id', topicId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((row: any) => ({
            id: row.id,
            topicId: topicId,
            userId: row.user_id,
            userName: 'Ciudadano ' + row.user_id.slice(0, 4),
            userAvatar: row.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user_id}`,
            content: row.content,
            createdAt: new Date(row.created_at).getTime()
        }));
    },

    async postComment(topicId: string, content: string, userId: string) {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                topic_id: topicId,
                user_id: userId,
                content: content
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
