import React, { useEffect, useState } from 'react';
import './App.css';

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Backend Data</h1>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: 'max-content', minWidth: '900px', borderCollapse: 'collapse', background: '#222', color: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#333' }}>
                <th style={{ padding: '0.5em 0.5em' }}>ID</th>
                <th style={{ padding: '0.5em 0.5em' }}>Titolo</th>
                <th style={{ padding: '0.5em 0.5em' }}>Descrizione</th>
                <th style={{ padding: '0.5em 0.5em' }}>Vani</th>
                <th style={{ padding: '0.5em 0.5em' }}>MetriQuadri</th>
                <th style={{ padding: '0.5em 0.5em' }}>Latitudine</th>
                <th style={{ padding: '0.5em 0.5em' }}>Longitudine</th>
                <th style={{ padding: '0.5em 0.5em' }}>Comune</th>
                <th style={{ padding: '0.5em 0.5em' }}>Città</th>
                <th style={{ padding: '0.5em 0.5em' }}>Provincia</th>
                <th style={{ padding: '0.5em 0.5em' }}>Nazione</th>
                <th style={{ padding: '0.5em 0.5em' }}>Foto</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((row, idx) => (
                <tr key={row.ID || idx} style={{ background: idx % 2 === 0 ? '#222' : '#292929' }}>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>{row.ID}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row.Titolo}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row.Descrizione}</td>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>{row.Vani}</td>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>{row.MetriQuadri}</td>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>{row.Latitudine}</td>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>{row.Longitudine}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row.Comune}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row['Città']}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row.Provincia}</td>
                  <td style={{ padding: '0.5em 0.5em' }}>{row.Nazione}</td>
                  <td style={{ padding: '0.5em 0.5em', textAlign: 'center' }}>
                    <img src={row.Foto} alt={row.Titolo} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
