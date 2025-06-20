import { useEffect, useState } from 'react';
import './App.css';
import { FaBed, FaRulerCombined, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9000/data')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  // Handler to open backend page for a property
  const handleCardClick = (id) => {
    if (id) {
      window.open(`http://localhost:9000/data/${id}`, '_blank');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Backend Data</h1>
        {error && <p className="error-message">Error: {error}</p>}
        <div className="card-list">
          {Array.isArray(data) && data.map((row, idx) => (
            <div
              className="property-card"
              key={row.ID || idx}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(row.ID)}
              tabIndex={0}
              role="button"
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(row.ID);
              }}
            >
              <img
                className="property-image"
                src={row.Foto}
                alt={row.Titolo}
              />
              <div className="property-details">
                <div className="property-prezzo">
                  <FaEuroSign className="property-prezzo-icon" />
                  <strong>
                    {row.Prezzo?.toLocaleString?.() || row.Prezzo}
                  </strong>
                </div>
                <div className="property-title">
                  {row.Titolo}
                </div>
                <div className="property-desc">
                  {row.Descrizione}
                </div>
                <div className="property-meta">
                  <span className="property-vani">
                    <FaBed /> {row.Vani} vani
                  </span>
                  <span className="property-mq">
                    <FaRulerCombined /> {row.MetriQuadri} m²
                  </span>
                </div>
                <div className="property-location">
                  <FaMapMarkerAlt className="property-location-icon" />
                  {row.Comune}, {row['Città']}, {row.Provincia}, {row.Nazione}
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
