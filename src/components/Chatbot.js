// Basic Help Chatbot Component

const helpResponses = {
    greeting: "Hello! 👋 Welcome to LearnFinnish! How can I help you?",
    help: `Here's what you can do:
• 📖 Generate stories - Read Finnish stories
• 🎴 Flashcards - Practice vocabulary
• 📚 Word Notebook - Save learned words
• 🌙 Dark mode - Reduce eye strain
• ⭐ Premium - Unlimited access

Ask a question or type "how" to get started!`,
    story: "To generate a new story, type a topic and click 'Generate Story'. Click on words in the story to see their translations!",
    flashcard: "To use flashcards, first add words to your notebook. Then click the 'Flashcards' tab and start practicing!",
    premium: "With Premium membership, get unlimited stories and flashcards! Only $4.99/month.",
    default: "Sorry, I didn't quite understand that. Type 'help' to see what I can do!"
};

export function initChatbot() {
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatButton || !chatWindow) return;

    let isOpen = false;

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('hidden', !isOpen);
        chatButton.classList.toggle('hidden', isOpen);

        if (isOpen && chatMessages.children.length === 0) {
            addMessage(helpResponses.greeting, 'bot');
        }
    });

    // Close chat
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            isOpen = false;
            chatWindow.classList.add('hidden');
            chatButton.classList.remove('hidden');
        });
    }

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        // Get response
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get response based on message
    function getResponse(message) {
        const msg = message.toLowerCase();

        if (msg.includes('help')) {
            return helpResponses.help;
        } else if (msg.includes('story')) {
            return helpResponses.story;
        } else if (msg.includes('flashcard') || msg.includes('card')) {
            return helpResponses.flashcard;
        } else if (msg.includes('premium') || msg.includes('price') || msg.includes('cost')) {
            return helpResponses.premium;
        } else if (msg.includes('how')) {
            return helpResponses.help;
        } else {
            return helpResponses.default;
        }
    }
}
