import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-akany-flm.png";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Code envoyé avec succès.");
  };

  return (
    <div className="forgot-page">
      <div className="forgot-shell">
        <aside className="forgot-visual">
          <div className="forgot-brand-row">
            <div className="forgot-brand-mark" aria-label="Logo Akany FLM">
              <img src={logo} alt="Logo Akany FLM" className="forgot-brand-svg" />
            </div>
            <div className="forgot-brand-name">Akany FLM</div>
          </div>

          <div className="forgot-visual-copy">
            <p className="forgot-tagline">LA GESTION LOCATIVE, SIMPLEMENT.</p>
            <h1>
              Vos résidences.
              <br />
              Vos loyers.
              <br />
              L’esprit tranquille.
            </h1>
            <p className="forgot-summary">
              Un seul espace pour vos biens, vos paiements
              <br />
              et les personnes qui y habitent.
            </p>
          </div>

          <div className="forgot-footer">
            <div className="forgot-footer-line">Clarté au quotidien. Confiance à chaque échéance.</div>
            <div className="forgot-footer-meta">Maquettes • Données d’exemple en FCFA</div>
          </div>
        </aside>

        <main className="forgot-panel">
          <div className="forgot-lang" aria-label="Choisir la langue">
            <span>Français</span>
            <span className="forgot-caret">▾</span>
          </div>

          <div className="forgot-card">
            <p className="forgot-kicker">ESPACE SÉCURISÉ</p>
            <h2 className="forgot-title">Mot de passe oublié ?</h2>
            <p className="forgot-subtitle">Recevez un code pour récupérer votre compte.</p>

            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="forgot-field-group">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  className="forgot-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aicha.diallo@email.com"
                  required
                />
              </div>

              <button className="forgot-submit" type="submit">
                Recevoir un code <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="forgot-help">Le code est valable pendant 10 minutes.</div>

            <div className="forgot-back-link" onClick={() => navigate("/login")}>
              ← Retour à la connexion
            </div>

            {message && <div className="forgot-alert">{message}</div>}

            <div className="forgot-legal">Vos données restent confidentielles et protégées.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;