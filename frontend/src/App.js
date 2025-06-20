import { useEffect, useState } from 'react';
import './App.css';
import { FaBed, FaRulerCombined, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with Webpack
delete L.Icon.Default?.prototype?._getIconUrl;
L.Icon.Default?.mergeOptions?.({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9000/data')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  // Handler to open popup for a property
  const handleCardClick = (row) => {
    setSelected(row);
  };

  // Handler to close popup
  const handleClosePopup = () => {
    setSelected(null);
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
              onClick={() => handleCardClick(row)}
              tabIndex={0}
              role="button"
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(row);
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
        {selected && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
              <button className="popup-close" onClick={handleClosePopup}>×</button>
              <img
                className="property-image"
                src={selected.Foto}
                alt={selected.Titolo}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <div className="property-details">
                <div className="property-prezzo">
                  <FaEuroSign className="property-prezzo-icon" />
                  <strong>
                    {selected.Prezzo?.toLocaleString?.() || selected.Prezzo}
                  </strong>
                </div>
                <div className="property-title">
                  {selected.Titolo}
                </div>
                <div className="property-desc">
                  {selected.Descrizione}
                </div>
                <div className="property-meta">
                  <span className="property-vani">
                    <FaBed /> {selected.Vani} vani
                  </span>
                  <span className="property-mq">
                    <FaRulerCombined /> {selected.MetriQuadri} m²
                  </span>
                </div>
                <div className="property-location">
                  <FaMapMarkerAlt className="property-location-icon" />
                  {selected.Comune}, {selected['Città']}, {selected.Provincia}, {selected.Nazione}
                </div>
              </div>
              {/* Leaflet Map */}
              {selected.Latitudine && selected.Longitudine && (
                <div style={{ height: '250px', width: '100%', marginTop: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                  <MapContainer
                    center={[selected.Latitudine, selected.Longitudine]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[selected.Latitudine, selected.Longitudine]}>
                      <LeafletPopup>
                        {selected.Titolo}
                      </LeafletPopup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      {/* Add some basic popup styles */}
      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .popup-content {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          max-width: 400px;
          width: 90vw;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        }
        .popup-close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default App;
