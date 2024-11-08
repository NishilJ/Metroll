import React, { useState } from 'react';

// Syed
const Routes: React.FC = () => {
  const [routeNumber, setRouteNumber] = useState<string>('');
  const [routeDetails, setRouteDetails] = useState<string | null>(null);

  const handleRouteSubmit = () => {
    if (routeNumber) {
      setRouteDetails(`Here are the details for Route ${routeNumber}.`);
    } else {
      alert('Please enter a route number.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '1em' }}>
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

      {routeDetails && (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0.5em' }}>
          <p>{routeDetails}</p>
        </div>
      )}
    </div>
  );
};

export default Routes;
