import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo-akany-flm.png";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState("ADMIN");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const data = await login(email, motDePasse);
      const normalizedUser = {
        id: data?.id ?? data?.idUtilisateur ?? null,
        nom: data?.nom || "",
        prenom: data?.prenom || "",
        email: data?.email || email,
        role: data?.role || role,
        token: data?.token || localStorage.getItem("token"),
      };

      if (data?.message === "Connexion réussie" || data?.role || data?.email || normalizedUser.id) {
        loginUser({ ...normalizedUser, user: normalizedUser });
        navigate(role === "ADMIN" ? "/admin" : "/locataire");
        return;
      }

      setMessage(data?.message || "Email ou mot de passe incorrect");
      setIsError(true);
    } catch (error) {
      const errMessage =
        error?.response?.data?.message ||
        "Impossible de contacter le backend local. Vérifiez que le serveur Spring Boot est démarré sur http://localhost:8080.";
      setMessage(errMessage);
      setIsError(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual">
          <div className="brand-row">
            <div className="brand-mark" aria-label="Logo Akany FLM">
              <img src={logo} alt="Logo Akany FLM" className="brand-svg" />
            </div>
            <div className="brand-name">Akany FLM</div>
          </div>

          <div className="auth-visual-copy">
            <p className="auth-tagline">LA GESTION LOCATIVE, SIMPLEMENT.</p>
            <h1>
              Vos résidences.
              <br />
              Vos loyers.
              <br />
              L’esprit tranquille.
            </h1>
            <p className="auth-summary">
              Un seul espace pour vos biens, vos paiements
              <br />
              et les personnes qui y habitent.
            </p>
          </div>

          <div className="auth-footer-block">
            <div className="auth-footer-line">Clarté au quotidien. Confiance à chaque échéance.</div>
          </div>
        </aside>

        <main className="auth-panel">
          <div className="login-card">
            <p className="login-kicker">ESPACE SÉCURISÉ</p>

            <h2 className="login-title">Heureux de vous revoir.</h2>
            <p className="login-subtitle">Connectez-vous pour retrouver votre espace de gestion.</p>

            <div className="role-toggle" aria-label="Type de compte">
              <button
                type="button"
                className={role === "ADMIN" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("ADMIN")}
              >
                Administrateur
              </button>
              <button
                type="button"
                className={role === "LOCATAIRE" ? "role-btn active" : "role-btn"}
                onClick={() => setRole("LOCATAIRE")}
              >
                Locataire
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie.kouame@entreprise.com"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="password-wrap">
                  <input
                    id="password"
                    className="input"
                    type={showPassword ? "text" : "password"}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <span className="eye-dot" />
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <button type="button" className="link-btn">
                  Mot de passe oublié ?
                </button>
              </div>

              <button className="connect-btn" type="submit">
                Se connecter <span aria-hidden="true">→</span>
              </button>
            </form>

            {message && <div className={`alert ${isError ? "error" : "success"}`}>{message}</div>}

            <p className="account-note">Votre compte est créé par votre gestionnaire.</p>
            <div className="legal-note">Vos données restent confidentielles et protégées.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;