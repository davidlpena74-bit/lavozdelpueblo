
import { supabase } from './supabase';
import { Topic, RegionCode } from '../../types';

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
    regionalVotes: row.regional_votes || {}, // Fallback for now/cache
    pros: row.pros || [],
    cons: row.cons || [],
    aiAnalysis: row.ai_analysis,
    hasVoted: row.has_voted // from view
});

export const api = {
    // Fetch all topics with stats
    async fetchTopics() {
        const { data, error } = await supabase
            .from('topics_with_stats')
            .select('*')
            .order('created_at', { ascending: false });

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
                ai_analysis: topic.aiAnalysis
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Cast a vote
    async castVote(topicId: string, choice: 'support' | 'oppose' | 'neutral', region: RegionCode) {
        // 1. Check if already voted (client side check, DB also enforces unique)
        // We'll rely on DB unique constraint to throw error if duplicate.

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
    }
};
