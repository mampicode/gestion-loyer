import { useState, useEffect } from "react";

function AddressAutocomplete({ value, onChange, placeholder = "Adresse" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (value.length >= 3) {
        searchAddress(value);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  const searchAddress = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=ci&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Erreur recherche adresse:", error);
    }
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
            boxShadow: "var(--shadow)",
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
                fontSize: 14,
              }}
              onMouseEnter={(e) => (e.target.style.background = "var(--bg)")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;