import { useState } from "react";
import { registerLocataire } from "../../services/authService";

const initialForm = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  pieceIdentite: "",
};

function Parametres() {
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const { prenom, nom, email, telephone } = form;
    if (!prenom || !nom || !email || !telephone) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        prenom,
        nom,
        email,
        telephone,
        adresse: form.adresse || "",
        pieceIdentite: form.pieceIdentite || "",
      };

      const response = await registerLocataire(payload);
      setMessage(response?.message || "Compte locataire créé avec succès. Un mot de passe temporaire a été envoyé.");
      setIsError(false);
      setForm(initialForm);
    } catch (error) {
      const errMessage =
        error?.response?.data?.message ||
        "Impossible d’inscrire le locataire pour le moment. Vérifiez la connexion au backend.";
      setMessage(errMessage);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="tenant-registration-page">
        <div className="tenant-registration-header-row">
          <div className="tenant-registration-breadcrumb">
            <span>Gestion locative</span>
            <span className="tenant-registration-separator">/</span>
            <span className="tenant-registration-current">Inscription locataire</span>
          </div>
        </div>

        <div className="tenant-registration-title-block">
          <h1>Inscrire un locataire</h1>
          <p>Créez son dossier et envoyez-lui un accès temporaire par e-mail.</p>
        </div>

        <div className="tenant-registration-layout">
          <div className="tenant-registration-form-card">
            <div className="tenant-registration-card-title">01 Informations du locataire</div>

            <form onSubmit={handleSubmit} className="tenant-registration-form">
              <div className="tenant-registration-grid">
                <div className="tenant-form-field">
                  <label htmlFor="prenom">Prénom <span>*</span></label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Nadia"
                  />
                </div>

                <div className="tenant-form-field">
                  <label htmlFor="nom">Nom <span>*</span></label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Coulibaly"
                  />
                </div>

                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="email">Adresse e-mail <span>*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nadia.coulibaly@email.com"
                  />
                </div>

                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="telephone">Téléphone (facultatif)</label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="+225 07 00 00 00 00"
                  />
                </div>

                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="adresse">Adresse</label>
                  <input
                    id="adresse"
                    name="adresse"
                    type="text"
                    value={form.adresse}
                    onChange={handleChange}
                    placeholder="Rue du Lac, Antananarivo"
                  />
                </div>

                <div className="tenant-form-field tenant-form-field-full">
                  <label htmlFor="pieceIdentite">Pièce d’identité</label>
                  <input
                    id="pieceIdentite"
                    name="pieceIdentite"
                    type="text"
                    value={form.pieceIdentite}
                    onChange={handleChange}
                    placeholder="CNI 12345678"
                  />
                </div>
              </div>

              <div className="tenant-registration-actionrow">
                <div className="tenant-registration-required-note">
                  <span>*</span> Champs obligatoires
                </div>

                <div className="tenant-registration-actions">
                  <button type="button" className="tenant-btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="tenant-btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi..." : "Inscrire et envoyer l’accès"}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              {message && (
                <div className={`tenant-registration-alert ${isError ? "error" : "success"}`}>
                  {message}
                </div>
              )}
            </form>
          </div>

          <aside className="tenant-registration-side-card">
            <div className="tenant-registration-card-title">Un accès, en trois étapes</div>

            <ol className="tenant-registration-steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Inscrire le locataire</strong>
                  <p>Enregistrez son nom et son adresse e-mail.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Envoyer les identifiants</strong>
                  <p>Il reçoit un accès temporaire personnel.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Activer son espace</strong>
                  <p>Il choisit son mot de passe définitif.</p>
                </div>
              </li>
            </ol>
          </aside>
        </div>

        <div className="tenant-registration-access-card">
          <div className="tenant-registration-access-content">
            <div className="tenant-registration-access-title">02 Création de l’accès</div>
            <p className="tenant-registration-access-role">Rôle attribué : <strong>Locataire</strong></p>
            <p>
              Un mot de passe temporaire sera généré et envoyé par e-mail. Le locataire devra le remplacer lors de sa première connexion.
            </p>
          </div>
          <div className="tenant-registration-access-note">
            Le logement sera associé ensuite.
            <p>L’inscription est unique. Le compte pourra ensuite être rattaché à son logement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parametres;