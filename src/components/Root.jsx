import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import EventsPage from '../pages/EventsPage';
import EventPage from '../pages/EventPage';
import { ChakraProvider } from '@chakra-ui/react';

function Root() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/events');
        const eventData = await response.json();
        updateEvents(eventData);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };
    fetchData();
  }, []);

  const updateEvents = (updatedEvents) => {
    setEvents(updatedEvents);
  };

  return (
    <ChakraProvider>
      <div>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<EventsPage events={events} updateEvents={updateEvents} />}
          />
          <Route path="/event/:id" element={<EventPage />} />
          
           
          
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default Root;
