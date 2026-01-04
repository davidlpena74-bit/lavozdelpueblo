document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const topicsList = document.getElementById('topics-list');
    const emptyState = document.getElementById('empty-state');
    const addTopicBtn = document.getElementById('add-topic-btn');
    const modal = document.getElementById('topic-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addTopicForm = document.getElementById('add-topic-form');
    const topicTitleInput = document.getElementById('topic-title');

    // State
    let topics = JSON.parse(localStorage.getItem('voteFlowTopics')) || [];

    // --- Core Functions ---

    function saveTopics() {
        localStorage.setItem('voteFlowTopics', JSON.stringify(topics));
    }

    function renderTopics() {
        topicsList.innerHTML = '';
        
        if (topics.length === 0) {
            topicsList.appendChild(emptyState);
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        // Sort by votes (descending)
        const sortedTopics = [...topics].sort((a, b) => b.votes - a.votes);

        sortedTopics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            
            card.innerHTML = `
                <div class="topic-content">
                    <h3>${escapeHtml(topic.title)}</h3>
                    <div class="topic-meta">Created ${new Date(topic.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="vote-controls">
                    <button class="vote-btn upvote" onclick="handleVote('${topic.id}', 1)">
                        ▲
                    </button>
                    <span class="vote-count">${topic.votes}</span>
                    <button class="vote-btn downvote" onclick="handleVote('${topic.id}', -1)">
                        ▼
                    </button>
                </div>
            `;
            topicsList.appendChild(card);
        });
    }

    function addTopic(title) {
        const newTopic = {
            id: crypto.randomUUID(),
            title: title,
            votes: 0,
            createdAt: new Date().toISOString()
        };
        topics.push(newTopic);
        saveTopics();
        renderTopics();
        closeModal();
    }

    // --- Event Listeners ---

    // Expose handleVote to global scope for inline onclicks
    window.handleVote = (id, change) => {
        const topicIndex = topics.findIndex(t => t.id === id);
        if (topicIndex !== -1) {
            topics[topicIndex].votes += change;
            saveTopics();
            renderTopics();
        }
    };

    addTopicBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        topicTitleInput.focus();
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    addTopicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = topicTitleInput.value.trim();
        if (title) {
            addTopic(title);
        }
    });

    function closeModal() {
        modal.classList.add('hidden');
        topicTitleInput.value = '';
    }

    // Utility
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Init
    renderTopics();
});
