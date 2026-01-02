export class ContactPage {
  constructor() {
    this.translations = {
      tr: {
        title: 'İletişim',
        subtitle: 'Bizimle İletişime Geçin',
        intro: 'Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşabilirsiniz. Size en kısa sürede dönüş yapacağız.',
        info: {
          title: 'İletişim Bilgileri',
          email: 'E-posta',
          phone: 'Telefon',
          location: 'Konum'
        },
        form: {
          title: 'Mesaj Gönderin',
          name: 'Adınız',
          email: 'E-posta Adresiniz',
          subject: 'Konu',
          message: 'Mesajınız',
          send: 'Gönder',
          success: 'Mesajınız başarıyla gönderildi!',
          error: 'Bir hata oluştu. Lütfen doğrudan e-posta gönderin.'
        },
        support: {
          title: 'Destek',
          text: 'Teknik destek veya hesap sorunları için lütfen e-posta gönderin. Genellikle 24 saat içinde yanıt veriyoruz.'
        }
      },
      en: {
        title: 'Contact',
        subtitle: 'Get in Touch',
        intro: 'Feel free to reach out to us with your questions, suggestions, or feedback. We will get back to you as soon as possible.',
        info: {
          title: 'Contact Information',
          email: 'Email',
          phone: 'Phone',
          location: 'Location'
        },
        form: {
          title: 'Send a Message',
          name: 'Your Name',
          email: 'Your Email',
          subject: 'Subject',
          message: 'Your Message',
          send: 'Send',
          success: 'Your message has been sent successfully!',
          error: 'An error occurred. Please send an email directly.'
        },
        support: {
          title: 'Support',
          text: 'For technical support or account issues, please send an email. We typically respond within 24 hours.'
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
            <p>${t.intro}</p>
          </section>

          <section class="legal-section">
            <h2>${t.info.title}</h2>
            <div class="contact-info-grid">
              <div class="contact-info-card">
                <div class="contact-icon">📧</div>
                <h3>${t.info.email}</h3>
                <a href="mailto:kapucuonur@hotmail.com">kapucuonur@hotmail.com</a>
              </div>
              <div class="contact-info-card">
                <div class="contact-icon">📱</div>
                <h3>${t.info.phone}</h3>
                <a href="tel:+358442359429">+358 44 235 9429</a>
              </div>
              <div class="contact-info-card">
                <div class="contact-icon">📍</div>
                <h3>${t.info.location}</h3>
                <p>Tampere, Finland</p>
              </div>
            </div>
          </section>

          <section class="legal-section">
            <h2>${t.form.title}</h2>
            <form id="contact-form" class="contact-form">
              <div class="form-group">
                <label for="contact-name">${t.form.name}</label>
                <input type="text" id="contact-name" required>
              </div>
              <div class="form-group">
                <label for="contact-email">${t.form.email}</label>
                <input type="email" id="contact-email" required>
              </div>
              <div class="form-group">
                <label for="contact-subject">${t.form.subject}</label>
                <input type="text" id="contact-subject" required>
              </div>
              <div class="form-group">
                <label for="contact-message">${t.form.message}</label>
                <textarea id="contact-message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">${t.form.send}</button>
            </form>
          </section>

          <section class="legal-section">
            <h2>${t.support.title}</h2>
            <p>${t.support.text}</p>
          </section>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('contact-form');
    // Since the 'lang' parameter was removed, we default to 'en' for translations
    const t = this.translations['en'];

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        // Create mailto link
        const mailtoLink = `mailto:kapucuonur@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;

        form.reset();
        alert(t.form.success);
      });
    }
  }
}
