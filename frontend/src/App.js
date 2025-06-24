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

  // State for search bar
  const [search, setSearch] = useState({
    metriMin: '',
    metriMax: '',
    vaniMin: '',
    vaniMax: '',
  });

  // Helper to check if a filter is set
  const isSet = v => v !== '' && v !== null && v !== undefined;

  // Fetch data when filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        let mqFiltered = null, vaniFiltered = null;

        // Both filters set
        if (isSet(search.metriMin) && isSet(search.metriMax) && isSet(search.vaniMin) && isSet(search.vaniMax)) {
          // Fetch both and intersect by ID
          const [mqRes, vaniRes] = await Promise.all([
            fetch(`http://localhost:9000/data/search/mq/${search.metriMin}&${search.metriMax}`).then(r => r.json()),
            fetch(`http://localhost:9000/data/search/vani/${search.vaniMin}&${search.vaniMax}`).then(r => r.json())
          ]);
          // Intersect by ID
          const mqIds = new Set(mqRes.map(r => r.ID));
          setData(vaniRes.filter(r => mqIds.has(r.ID)));
        } else if (isSet(search.metriMin) && isSet(search.metriMax)) {
          // Only metri filter
          const mqRes = await fetch(`http://localhost:9000/data/search/mq/${search.metriMin}&${search.metriMax}`).then(r => r.json());
          setData(mqRes);
        } else if (isSet(search.vaniMin) && isSet(search.vaniMax)) {
          // Only vani filter
          const vaniRes = await fetch(`http://localhost:9000/data/search/vani/${search.vaniMin}&${search.vaniMax}`).then(r => r.json());
          setData(vaniRes);
        } else {
          // No filters, fetch all
          const all = await fetch('http://localhost:9000/data').then(r => r.json());
          setData(all);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFiltered();
  }, [search.metriMin, search.metriMax, search.vaniMin, search.vaniMax]);

  // Handler to open popup for a property
  const handleCardClick = (row) => {
    setSelected(row);
  };

  // Handler to close popup
  const handleClosePopup = () => {
    setSelected(null);
  };

  // Handler for search bar input (aesthetic only)
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Backend Data</h1>
        {/* Search Bar (Aesthetic Only) */}
        <form
          className="search-bar"
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            marginBottom: '2rem',
            background: '#f7f7f7',
            padding: '1.5rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            justifyContent: 'center', // center horizontally
            fontSize: '1.25rem',      // bigger text
            fontWeight: 500
          }}
        >
          <div>
            <label style={{ marginRight: 8, fontSize: '1.15em' }}>
              <FaRulerCombined style={{ verticalAlign: 'middle' }} /> Metri Quadri:
            </label>
            <input
              type="number"
              name="metriMin"
              placeholder="Min"
              value={search.metriMin}
              onChange={handleSearchChange}
              style={{ width: 80, marginRight: 12, fontSize: '1.1em', padding: '0.3em 0.5em' }}
            />
            <span style={{ margin: '0 8px' }}>-</span>
            <input
              type="number"
              name="metriMax"
              placeholder="Max"
              value={search.metriMax}
              onChange={handleSearchChange}
              style={{ width: 80, fontSize: '1.1em', padding: '0.3em 0.5em' }}
            />
          </div>
          <div>
            <label style={{ marginRight: 8, fontSize: '1.15em' }}>
              <FaBed style={{ verticalAlign: 'middle' }} /> Vani:
            </label>
            <input
              type="number"
              name="vaniMin"
              placeholder="Min"
              value={search.vaniMin}
              onChange={handleSearchChange}
              style={{ width: 60, marginRight: 12, fontSize: '1.1em', padding: '0.3em 0.5em' }}
            />
            <span style={{ margin: '0 8px' }}>-</span>
            <input
              type="number"
              name="vaniMax"
              placeholder="Max"
              value={search.vaniMax}
              onChange={handleSearchChange}
              style={{ width: 60, fontSize: '1.1em', padding: '0.3em 0.5em' }}
            />
          </div>
          <button
            type="button"
            style={{
              padding: '0.7rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              background: '#1976d2',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1em',
              cursor: 'not-allowed',
              opacity: 0.7
            }}
          >
            Cerca
          </button>
        </form>
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
                  {[row.Comune, row['Città'], row.Provincia, row.Nazione]
                    .map(val => typeof val === 'string' ? val : '')
                    .filter(Boolean)
                    .join(', ')}
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
                  {selected.DescSpecifica}
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
                  {[selected.Comune, selected['Città'], selected.Provincia, selected.Nazione]
                    .map(val => typeof val === 'string' ? val : '')
                    .filter(Boolean)
                    .join(', ')}
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
    </div>
  );
}

export default App;
