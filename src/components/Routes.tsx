import React, { useState } from 'react';

const Routes: React.FC = () => {
  const [routeNumber, setRouteNumber] = useState<string>('');
  const [routeDetails, setRouteDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRouteSubmit = async () => {
    if (!routeNumber) {
      alert('Please enter a route number.');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteDetails(null);

    try {
      // Ask the API for the route number, this is just a placeholder for now
      const response = await fetch(`https://europe.motis-project.de=${routeNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch route details.');
      }

      const data = await response.json();
      // Assuming the API returns an object with a `description` field for the route
      setRouteDetails(data.description);
    } catch (error) {
      setError('Could not retrieve route details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '1em' }}>
      {/* Input Field */}
      <div style={{ position: 'relative', marginBottom: '1em' }}>
        <input
          type="text"
          placeholder="Enter route number..."
          value={routeNumber}
          onChange={(e) => setRouteNumber(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5em 0.1em 0.5em 0.1em',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <div
          onClick={handleRouteSubmit}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#888' }}
          >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <line x1="21" y1="21" x2="15.9" y2="15.9" />
          </svg>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <p style={{ color: '#888', textAlign: 'center' }}>Loading route details...</p>}

      {/* Error Message */}
      {error && (
        <div style={{ color: '#D9534F', textAlign: 'center', marginTop: '1em' }}>
          {error}
        </div>
      )}

      {/* Route Details */}
      {routeDetails && (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '1em',
            backgroundColor: '#f9f9f9',
            marginTop: '1em',
          }}
        >
          <h4 style={{ margin: '0 0 0.5em 0', fontSize: '1em', fontWeight: 'bold' }}>Route Description</h4>
          <p style={{ margin: '0', fontSize: '0.9em', color: '#333' }}>{routeDetails}</p>
        </div>
      )}
    </div>
  );
};

export default Routes;
