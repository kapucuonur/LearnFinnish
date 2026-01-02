export class PrivacyPage {
  constructor() {
    this.translations = {
      en: {
        title: 'Privacy Policy',
        lastUpdated: 'Last Updated: December 22, 2024',
        intro: 'At LearnFinnish, we are committed to protecting the privacy of our users. This privacy policy explains how we collect, use, and protect your personal data.',
        sections: [
          {
            title: '1. Information We Collect',
            content: `
              <p>When using LearnFinnish, we may collect the following information:</p>
              <ul>
                <li><strong>Account Information:</strong> Your name and email address when you sign in with your Google account</li>
                <li><strong>Usage Data:</strong> Stories you create, words you save, and your learning progress</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage statistics</li>
                <li><strong>Cookies:</strong> We use cookies for session management and to improve user experience</li>
              </ul>
            `
          },
          {
            title: '2. How We Use Your Information',
            content: `
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li>To provide and improve our services</li>
                <li>To offer personalized learning experiences</li>
                <li>To manage and secure user accounts</li>
                <li>To provide technical support</li>
                <li>To conduct usage analytics and improve service quality</li>
                <li>To fulfill our legal obligations</li>
              </ul>
            `
          },
          {
            title: '3. Information Sharing',
            content: `
              <p>We do not share your personal information with third parties. However, information sharing may be necessary in the following cases:</p>
              <ul>
                <li><strong>Service Providers:</strong> Firebase (authentication and database), Stripe (payment processing), Google AdSense (advertising)</li>
                <li><strong>Legal Requirements:</strong> Legal processes or requests from public authorities</li>
                <li><strong>Business Transfer:</strong> In case of merger, acquisition, or asset sale</li>
              </ul>
            `
          },
          {
            title: '4. Data Security',
            content: `
              <p>We use industry-standard security measures to protect your personal data:</p>
              <ul>
                <li>Secure data transmission with SSL/TLS encryption</li>
                <li>Database protection with Firebase security rules</li>
                <li>Regular security updates and monitoring</li>
                <li>Limited access controls</li>
              </ul>
            `
          },
          {
            title: '5. Cookies and Tracking Technologies',
            content: `
              <p>We use the following types of cookies on our site:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for session management and basic functionality</li>
                <li><strong>Analytics Cookies:</strong> To understand and improve site usage</li>
                <li><strong>Advertising Cookies:</strong> For personalized ads by Google AdSense</li>
              </ul>
              <p>You can manage cookies through your browser settings.</p>
            `
          },
          {
            title: '6. User Rights',
            content: `
              <p>Under GDPR and KVKK, you have the following rights:</p>
              <ul>
                <li><strong>Right to Access:</strong> You can request access to your personal data</li>
                <li><strong>Right to Rectification:</strong> You can request correction of incorrect or incomplete information</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your account and data</li>
                <li><strong>Right to Object:</strong> You can object to data processing activities</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a structured format</li>
              </ul>
              <p>To exercise these rights, please contact us at kapucuonur@hotmail.com.</p>
            `
          },
          {
            title: '7. Children\'s Privacy',
            content: `
              <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and become aware that your child has provided us with personal information, please contact us.</p>
            `
          },
          {
            title: '8. Third-Party Links',
            content: `
              <p>Our site may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We recommend reading their privacy policies when visiting other sites.</p>
            `
          },
          {
            title: '9. Policy Changes',
            content: `
              <p>We may update this privacy policy from time to time. We will notify you of significant changes. We recommend reviewing the policy regularly.</p>
            `
          },
          {
            title: '10. Contact',
            content: `
              <p>If you have questions about our privacy policy, you can contact us:</p>
              <ul>
                <li><strong>Email:</strong> kapucuonur@hotmail.com</li>
                <li><strong>Phone:</strong> +358 44 235 9429</li>
                <li><strong>Address:</strong> Tampere, Finland</li>
              </ul>
            `
          }
        ]
      }
    };
  }

  render() {
    const t = this.translations['en'];

    return `
      <div class="legal-page">
        <div class="legal-header">
          <h1>${t.title}</h1>
          <p class="legal-date">${t.lastUpdated}</p>
        </div>

        <div class="legal-content">
          <section class="legal-section">
            <p class="legal-intro">${t.intro}</p>
          </section>

          ${t.sections.map(section => `
            <section class="legal-section">
              <h2>${section.title}</h2>
              ${section.content}
            </section>
          `).join('')}
        </div>
      </div>
    `;
  }
}
