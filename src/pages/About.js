export class AboutPage {
  constructor() {
    this.translations = {
      en: {
        title: 'About Us',
        subtitle: 'LearnFinnish - The Easiest Way to Learn Finnish',
        mission: {
          title: 'Our Mission',
          text: 'LearnFinnish aims to provide an interactive and fun learning experience for everyone who wants to learn Finnish. With our AI-powered stories and flashcard system, we help you improve your Finnish vocabulary.'
        },
        features: {
          title: 'Our Features',
          items: [
            {
              icon: '📖',
              title: 'AI-Powered Stories',
              text: 'We create engaging Finnish stories tailored to your level'
            },
            {
              icon: '🎴',
              title: 'Smart Flashcards',
              text: 'Interactive flashcard system for vocabulary memorization'
            },
            {
              icon: '📚',
              title: 'Personal Word Notebook',
              text: 'Save and track the words you learn'
            },
            {
              icon: '🌍',
              title: 'User-Friendly Interface',
              text: 'Clean English interface for easy navigation'
            }
          ]
        },
        team: {
          title: 'Our Team',
          text: 'LearnFinnish is developed by a team living in Finland who have experienced the Finnish learning process. Based on our own experiences, we created this platform to make language learning easier and more enjoyable.'
        },
        contact: {
          title: 'Contact',
          text: 'Feel free to contact us with your questions or suggestions.'
        }
      }
    };
  }

  render() {
    const t = this.translations['en'];

    return `
      <div class="legal-page">
        <div class="legal-header">
          <h1>${t.title}</h1>
          <p class="legal-subtitle">${t.subtitle}</p>
        </div>

        <div class="legal-content">
          <section class="legal-section">
            <h2>${t.mission.title}</h2>
            <p>${t.mission.text}</p>
          </section>

          <section class="legal-section">
            <h2>${t.features.title}</h2>
            <div class="features-grid">
              ${t.features.items.map(item => `
                <div class="feature-card">
                  <div class="feature-icon">${item.icon}</div>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="legal-section">
            <h2>${t.team.title}</h2>
            <p>${t.team.text}</p>
          </section>

          <section class="legal-section">
            <h2>${t.contact.title}</h2>
            <p>${t.contact.text}</p>
            <div class="contact-info">
              <p><strong>Email:</strong> kapucuonur@hotmail.com</p>
              <p><strong>Location:</strong> Tampere, Finland</p>
            </div>
          </section>
        </div>
      </div>
    `;
  }
}
