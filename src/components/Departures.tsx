import React, { useState } from 'react';
import {} from '@adobe/react-spectrum';

// Carver
const Departures: React.FC = () => {
  const [searchStops, setSearchStops] = useState<string>('');
  const [stopDetails, setStopDetails] = useState<string | null>(null);

  <Form maxWidth="size-5000">
    <TextField type="searchInput" />
    <ButtonGroup>
      <Button type="search" variant="primary">
        Search
      </Button>
    </ButtonGroup>
  </Form>
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (searchStops)
      setStopDetails(`Searching for ${searchStops}...`);
    else
      alert('Please enter a stop name.');
  };

  return (
    // the final bit i havent finished TOT
  );
}

export default Departures;