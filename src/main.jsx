import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'; // Removed CSSReset
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './components/Root';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import AddEventForm from './components/AddEventForm';

const rootElement = document.getElementById('root');

if (rootElement) {
  const App = () => {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
      // Fetch events data
      fetch('http://localhost:3000/events')
        .then((response) => response.json())
        .then((eventData) => updateEvents(eventData))
        .catch((error) => {
          console.error('Error fetching events data:', error);
        });

      // Fetch users data
      fetch('http://localhost:3000/users')
        .then((response) => response.json())
        .then((userData) => setUsers(userData))
        .catch((error) => {
          console.error('Error fetching users data:', error);
        });
    }, []);

    const updateEvents = (updatedEvents) => {
      setEvents(updatedEvents);
    };

    const handleAddEvent = async (newEvent) => {
      try {
        // Generate a unique ID for the new event (you can use your preferred method)
        const uniqueId = generateUniqueId(); // Implement your own unique ID generation logic

        // Assign the unique ID to the new event
        newEvent.id = uniqueId;

        // Send a POST request to your backend to add the new event
        const response = await fetch('http://localhost:3000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
          throw new Error('Failed to add event');
        }

        // Parse the response to get the newly added event
        const addedEvent = await response.json();

        // Update events with the new event
        const updatedEvents = [...events, addedEvent];
        updateEvents(updatedEvents);

        
      } catch (error) {
        console.error('Error adding event:', error);
      }
    };

    return (
      <ChakraProvider>
        <Router>
          <Routes>
            <Route
              path="/events"
              element={
                <EventsPage 
                 
                  events={events} 
                  updateEvents={updateEvents}
                  users={users}
                  updateUsers={setUsers}
                />
              }
            />
            <Route path="/event/:id" element={<EventPage />} />
            <Route
              path="/add-event"
              element={
                <AddEventForm
                  isOpen={true}
                  onClose={false}
                  onSubmit={handleAddEvent}
                  updateEvents={updateEvents}
                  events={events}
                  users={users}
                  updateUsers={setUsers}
                />
              }
            />
            <Route path="*" element={<Root />} /> {/* Moved this wildcard route to the last position */}
          </Routes>
        </Router>
      </ChakraProvider>
    );
  };

  if (rootElement) {
    const appRoot = ReactDOM.createRoot(rootElement);
    appRoot.render(<App />);
  }
}

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000); // Add randomness to ensure uniqueness
  return `${timestamp}-${randomPart}`;
}
