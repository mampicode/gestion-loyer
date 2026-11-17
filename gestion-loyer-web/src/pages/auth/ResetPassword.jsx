import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-akany-flm.png";

function ResetPassword() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(48);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextCode = Array(6).fill("");
    pasted.split("").forEach((digit, index) => {
      if (index < 6) nextCode[index] = digit;
    });
    setCode(nextCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const resetCountdown = () => {
    setCountdown(48);
  };

  const formatCountdown = (value) => {
    const minutes = String(Math.floor(value / 60)).padStart(2, "0");
    const seconds = String(value % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="verification-page">
      <div className="verification-shell">
        <aside className="verification-visual">
          <div className="verification-brand-row">
            <div className="verification-brand-mark" aria-label="Logo Akany FLM">
              <img src={logo} alt="Logo Akany FLM" className="verification-brand-svg" />
            </div>
            <div className="verification-brand-name">Akany FLM</div>
          </div>

          <div className="verification-visual-copy">
            <p className="verification-tagline">LA GESTION LOCATIVE, SIMPLEMENT.</p>
            <h1>
              Vos résidences.
              <br />
              Vos loyers.
              <br />
              L’esprit tranquille.
            </h1>
            <p className="verification-summary">
              Un seul espace pour vos biens, vos paiements
              <br />
              et les personnes qui y habitent.
            </p>
          </div>

          <div className="verification-footer-block">
            <div className="verification-footer-line">Clarté au quotidien. Confiance à chaque échéance.</div>
          </div>
        </aside>

        <main className="verification-panel">
          <div className="verification-card">
            <p className="verification-kicker">ESPACE SÉCURISÉ</p>
            <h2 className="verification-title">Vérifiez votre e-mail.</h2>
            <p className="verification-subtitle">
              Saisissez le code à 6 chiffres envoyé à
              <br />
              aicha.diallo@email.com.
            </p>

            <div className="verification-code-row" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className={`verification-digit ${index === 5 ? "is-last" : ""}`}
                  aria-label={`Chiffre ${index + 1}`}
                />
              ))}
            </div>

            <button type="button" className="verification-resend" onClick={resetCountdown}>
              Renvoyer le code dans {formatCountdown(countdown)}
            </button>

            <button className="verification-submit" type="button">
              Vérifier le code <span aria-hidden="true">→</span>
            </button>

            <div className="verification-edit-link" onClick={() => navigate("/forgot-password")}>
              ← Modifier mon adresse e-mail
            </div>

            <div className="verification-legal">Vos données restent confidentielles et protégées.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResetPassword;