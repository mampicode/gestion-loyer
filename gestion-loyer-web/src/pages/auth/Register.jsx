import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-akany-flm.png";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!email || !motDePasse) {
      setMessage("Veuillez remplir tous les champs.");
      setIsError(true);
      return;
    }

    setMessage("Compte activé avec succès.");
  };

  return (
    <div className="register-page">
      <div className="register-shell">
        <aside className="register-visual">
          <div className="register-brand-row">
            <div className="register-brand-mark" aria-label="Logo Akany FLM">
              <img src={logo} alt="Logo Akany FLM" className="register-brand-svg" />
            </div>
            <div className="register-brand-name">Akany FLM</div>
          </div>

          <div className="register-visual-copy">
            <p className="register-tagline">LA GESTION LOCATIVE, SIMPLEMENT.</p>
            <h1>
              Vos résidences.
              <br />
              Vos loyers.
              <br />
              L’esprit tranquille.
            </h1>
            <p className="register-summary">
              Un seul espace pour vos biens, vos paiements
              <br />
              et les personnes qui y habitent.
            </p>
          </div>

          <div className="register-footer">
            <div className="register-footer-line">Clarté au quotidien. Confiance à chaque échéance.</div>
          </div>
        </aside>

        <main className="register-panel">
          <div className="register-header-pill" aria-label="Choisir la langue">
            <span className="register-header-icon">✦</span>
          </div>

          <div className="register-language" aria-label="Choisir la langue">
            <span>Français</span>
            <span className="register-caret">▾</span>
          </div>

          <div className="register-card">
            <p className="register-kicker">ESPACE SÉCURISÉ</p>
            <h2 className="register-title">Activez votre espace.</h2>
            <p className="register-subtitle">Un compte vous a été créé par votre gestionnaire.</p>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-field-group">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  className="register-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aicha.diallo@email.com"
                  required
                />
              </div>

              <div className="register-field-group">
                <label htmlFor="password">Mot de passe temporaire</label>
                <div className="register-password-wrap">
                  <input
                    id="password"
                    className="register-input"
                    type={showPassword ? "text" : "password"}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="register-eye-button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <span className="register-eye-dot" />
                  </button>
                </div>
              </div>

              <div className="register-info-box">
                <div className="register-info-box__title">Première connexion</div>
                <div className="register-info-box__text">Vous choisirez ensuite votre mot de passe personnel.</div>
              </div>

              <button className="register-submit" type="submit">
                Activer mon compte <span aria-hidden="true">→</span>
              </button>
            </form>

            <div className="register-login-link">
              Déjà activé ? <span onClick={() => navigate("/login")}>Se connecter</span>
            </div>

            {message && <div className={`register-alert ${isError ? "error" : "success"}`}>{message}</div>}

            <div className="register-legal">Vos données restent confidentielles et protégées.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;