import React, { useState } from 'react';
import { ComboBox, Item, Flex } from '@adobe/react-spectrum';
import { Search } from '@spectrum-icons/workflow/Search';

const StopSearchDropdown = () => {
  // Initial empty list of stops
  const [allStops, setAllStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);

  const handleInputChange = (inputValue) => {
    // Generate results dynamically based on input
    if (inputValue) {
      const generatedResults = Array.from({ length: 5 }, (_, index) => ({
        id: `${index + 1}`,
        name: `${inputValue} Result ${index + 1}`
      }));
      setFilteredStops(generatedResults);
    } else {
      setFilteredStops([]); // Clear results if input is empty
    }
  };

  return (
    <Flex direction="column" gap="size-200" width="size-2400">
      {/* Start Point ComboBox */}
      <ComboBox 
        label="Start point" 
        placeholder="Start point..."
        items={filteredStops} 
        onInputChange={handleInputChange}
        allowsCustomValue
      >
        {item => <Item key={item.id}>{item.name}</Item>}
      </ComboBox>

      {/* End Point ComboBox */}
      <ComboBox 
        label="End point" 
        placeholder="End point..."
        items={filteredStops} 
        onInputChange={handleInputChange}
        allowsCustomValue
      >
        {item => <Item key={item.id}>{item.name}</Item>}
      </ComboBox>
    </Flex>
  );
};

export default StopSearchDropdown;


