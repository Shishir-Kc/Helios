import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import './AppLayout.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="app-wrapper">
      <Header onOpenPopup={() => setShowPopup(true)} />
      
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-eyebrow">Local Intelligence, Refined</div>
            <h1 className="h1 hero-title">HELIOS</h1>
            <p className="body-text hero-sub">
              A family of fine-tuned language models
            </p>
            <p className="body-small hero-desc">
              Handcrafted AI models trained on personal hardware. Each Helios model is a deliberate experiment in fine-tuning, personality, and performance built from curiosity, not a datacenter.
            </p>
            <div className="hero-actions">
              <Button variant="primary" onClick={() => setShowPopup(true)}>Explore Models</Button>
              <Button variant="secondary" onClick={() => setShowPopup(true)}>Read the Docs</Button>
            </div>
          </div>
        </section>

        {/* MODEL FAMILIES SECTION */}
        <section className="models-section">
          <div className="container">
            <div className="section-label">Model Families</div>
            <h2 className="h2 section-title">Meet the families</h2>
            <p className="body-small section-desc">
              Each Helios family is a distinct line of fine-tuned models, built for a specific purpose and personality. Running entirely on local hardware.
            </p>

            <div className="models-grid">
              <Card variant="feature">
                {/* <Badge variant="success" style={{ marginBottom: '24px' }}>Live</Badge> */}
                <h3 className="h3">Aurora</h3>
                <div className="model-family">Helios Gen I</div>
                <p className="body-small model-desc">
                  A warm, conversational general-purpose assistant. Aurora is crafted for natural dialogue, thoughtful reasoning, and everyday tasks, the first light of the Helios family.
                </p>
                <div className="model-base caption">
                  Base: <strong>Gemma 3</strong> · Fine-tuned locally
                </div>
              </Card>

              <Card variant="standard">
                {/* <Badge variant="neutral" style={{ marginBottom: '24px' }}>Coming soon</Badge> */}
                <h3 className="h3">???</h3>
                <div className="model-family">Helios Gen II</div>
                <p className="body-small model-desc">
                  The next Helios family is in early research. Each new family explores a different dimension, from specialized coding to creative generation.
                </p>
                <div className="model-base caption">
                  Details <strong>TBA</strong>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="philosophy-section">
          <div className="container">
            <div className="section-label">Philosophy</div>
            <h2 className="h2 section-title">Built in the spirit of exploration</h2>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="h3 feature-title">Home Server Native</h3>
                <p className="body-small">Every model in the Helios family runs on personal hardware. No cloud, no API calls, just raw local compute.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 6 C10 10 10 22 16 26 C22 22 22 10 16 6Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 16h20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="h3 feature-title">Fine-tuned Personality</h3>
                <p className="body-small">Not just a base model download. Each family has been deliberately shaped through careful fine-tuning and iteration.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M16 4L28 10v12L16 28 4 22V10L16 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 4v24M4 10l12 6 12-6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="h3 feature-title">Growing Family</h3>
                <p className="body-small">Aurora is just the beginning. Helios is designed to house multiple model families, each exploring different capabilities and domains.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M6 26L16 6l10 20" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 20h14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="h3 feature-title">Open Learning</h3>
                <p className="body-small">A hobby project with soul. Helios is about learning the craft of fine-tuning, model design, and AI development end-to-end.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section">
          <div className="container cta-container">
            <h2 className="h1 cta-title">The sun is rising</h2>
            <p className="body-text cta-sub">
              Helios Aurora is the first model. More families are on the horizon.
            </p>
            <div className="cta-actions">
              {/* <Button variant="primary">Get Early Access</Button> */}
              {/* <Button variant="secondary">Follow the Journey</Button> */}
            </div>
          </div>
        </section>
      </main>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 className="h3" style={{ marginBottom: '16px' }}>Site in Development</h3>
              <p className="body-small" style={{ marginBottom: '32px' }}>
                We are sorry, for now this site is in development. This site will be functional after the owner's exams are completed!
              </p>
              <Button variant="secondary" onClick={() => setShowPopup(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </div>
  );
}

export default App;
