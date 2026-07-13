import { Header } from './components/Header';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import { CategoryList } from './pages/CategoryList';
import { CategoryDetail } from './pages/CategoryDetail';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './AppLayout.css';

function HomePage() {
  const navigate = useNavigate();
  return (
    <main>
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
            <Button variant="primary" onClick={() => navigate('/papers')}>Explore Models</Button>
            <Button variant="secondary" onClick={() => navigate('/docs')}>Read the Docs</Button>
          </div>
        </div>
      </section>

      <section className="models-section">
        <div className="container">
          <div className="section-label">Model Families</div>
          <h2 className="h2 section-title">Meet the families</h2>
          <p className="body-small section-desc">
            Each Helios family is a distinct line of fine-tuned models, built for a specific purpose and personality. Running entirely on local hardware.
          </p>

          <div className="models-grid">
            <Card variant="feature">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <Badge variant="neutral" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>8B Params</Badge>
                <Badge variant="neutral" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>128k Context</Badge>
              </div>
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
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <Badge variant="neutral">In Research</Badge>
              </div>
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

      <section className="cta-section">
        <div className="container cta-container">
          <h2 className="h1 cta-title">The sun is rising</h2>
          <p className="body-text cta-sub">
            Helios Aurora is the first model. More families are on the horizon.
          </p>
          <div className="cta-actions">
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/papers" element={<CategoryList category="papers" />} />
        <Route path="/research" element={<CategoryList category="research" />} />
        <Route path="/docs" element={<CategoryList category="docs" />} />
        <Route path="/papers/:slug" element={<CategoryDetail />} />
        <Route path="/research/:slug" element={<CategoryDetail />} />
        <Route path="/docs/:slug" element={<CategoryDetail />} />
      </Routes>
    </div>
  );
}

export default App;
