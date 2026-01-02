export class AboutPage {
  constructor() {
    this.translations = {
      tr: {
        title: 'Hakkımızda',
        subtitle: 'LearnFinnish - Fince Öğrenmenin En Kolay Yolu',
        mission: {
          title: 'Misyonumuz',
          text: 'LearnFinnish, Fince öğrenmek isteyen herkes için etkileşimli ve eğlenceli bir öğrenme deneyimi sunmayı amaçlamaktadır. Yapay zeka destekli hikayeler ve flashcard sistemimiz ile Fince kelime dağarcığınızı geliştirmenize yardımcı oluyoruz.'
        },
        features: {
          title: 'Özelliklerimiz',
          items: [
            {
              icon: '📖',
              title: 'AI Destekli Hikayeler',
              text: 'Seviyenize uygun, ilgi çekici Fince hikayeler oluşturuyoruz'
            },
            {
              icon: '🎴',
              title: 'Akıllı Flashcardlar',
              text: 'Kelime ezberlemek için etkileşimli flashcard sistemi'
            },
            {
              icon: '📚',
              title: 'Kişisel Kelime Defteri',
              text: 'Öğrendiğiniz kelimeleri kaydedin ve takip edin'
            },
            {
              icon: '🌍',
              title: 'Çift Dil Desteği',
              text: 'Türkçe ve İngilizce arayüz seçenekleri'
            }
          ]
        },
        team: {
          title: 'Ekibimiz',
          text: 'LearnFinnish, Finlandiya\'da yaşayan ve Fince öğrenme sürecini deneyimleyen bir ekip tarafından geliştirilmiştir. Kendi deneyimlerimizden yola çıkarak, dil öğrenmeyi daha kolay ve eğlenceli hale getirmek için bu platformu oluşturduk.'
        },
        contact: {
          title: 'İletişim',
          text: 'Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.'
        }
      },
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
              title: 'Bilingual Support',
              text: 'Turkish and English interface options'
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
