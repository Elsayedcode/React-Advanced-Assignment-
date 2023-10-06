import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Image, Button, Heading, Input, Flex, Select, Text, VStack,
} from '@chakra-ui/react';
import AddEventForm from '../components/AddEventForm';

function EventsPage({   updateEvents }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [users, setUsers] = useState( []);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [userLookup, setUserLookup] = useState({});
  const [events, setEvents] = useState([]);  // Line is already added


  const handleAddEvent = async (newEvent) => {
    try {
      // Fetch the user ID, either updates the user or adds a new user
      const userId = await handleUserAddOrUpdate(newEvent);

      const uniqueId = generateUniqueId(); 

      const structuredEvent = {
        id: uniqueId,
        createdBy: userId, 
        title: newEvent.title,
        description: newEvent.description,
        image: newEvent.image,
        categoryIds: newEvent.categoryIds.map(id => parseInt(id, 10)), 
        location: newEvent.location,
        startTime: new Date(newEvent.startTime).toISOString(), 
        endTime: new Date(newEvent.endTime).toISOString()
      };
  
      // Send a POST request to your backend to add the new event
      const eventResponse = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(structuredEvent),
      });

      if (!eventResponse.ok) {
        throw new Error('Failed to add event');
      }

      const addedEvent = await eventResponse.json();
      const updatedEvents = [...events, addedEvent];
      updateEvents(updatedEvents);
      setShowAddEventModal(false);
    } catch (error) {
      console.error('Error adding event or user:', error);
    }
  };


// Fetching users
useEffect(() => {
  fetch('http://localhost:3000/users')
    .then((response) => response.json())
    .then((userData) => {
      setUsers(userData);
      const lookup = userData.reduce((acc, user) => {
        acc[String(user.id)] = user;  // Modified line
        return acc;
      }, {});
      setUserLookup(lookup);
    })
    .catch((error) => {
      console.error('Error fetching users data:', error);
    });
}, []);

// Fetching events
useEffect(() => {
  fetch('http://localhost:3000/events')
    .then((response) => response.json())
    .then((eventData) => {
      setEvents(eventData);
    })
    .catch((error) => {
      console.error('Error fetching events data:', error);
    });
}, []);

const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  // Parse the generated ID to an integer using the unary plus operator
  return +(timestamp.toString() + randomPart.toString());
};

const handleUserAddOrUpdate = async (newEvent) => {
  const existingUser = users.find(user => user.name === newEvent.createdBy);
  let userData;
  let newUserId;

  if (existingUser) {
    userData = { ...existingUser, image: newEvent.image };
  } else {
    newUserId = generateUniqueId(); // Ensure this returns a number
    userData = {
      id: newUserId,
      name: newEvent.createdBy,
      image: newEvent.image,
    };
  }

    const userResponse = await fetch('http://localhost:3000/users', {
      method: existingUser ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!userResponse.ok) {
      throw new Error('Failed to add/update user');
    }

    const updatedUser = await userResponse.json();
    const updatedUsers = existingUser
      ? users.map(u => (u.id === updatedUser.id ? updatedUser : u))
      : [...users, updatedUser];
    setUsers(updatedUsers);

    return existingUser ? existingUser.id : newUserId;
  };



  const handleOpenAddEventModal = () => {
    setShowAddEventModal(true);
  };

  const handleCloseAddEventModal = () => {
    setShowAddEventModal(false);
  };

  const filteredEvents = events.filter((event) => {
    const eventTitle = event?.title?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    const titleMatch = eventTitle.includes(searchTermLower);
    const categoryMatch = event.categoryIds && (filterCategory === '' || 
      event.categoryIds.includes(parseInt(filterCategory,10)));

    return titleMatch && categoryMatch;
  });
 
  return (
    <VStack spacing="4" align="stretch">
      <Box>
      <Flex justifyContent="center" alignItems="center" >
            <Button colorScheme="red" mt={4} onClick={handleOpenAddEventModal}>Add Event</Button>
        </Flex>
        <Box my="4">
          <Input
            placeholder="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            mt="2"
          >
            <option value="">All Categories</option>
            <option value="1">Sports</option>
            <option value="2">Games</option>
            <option value="3">Relaxation</option>
            
          </Select>
        </Box>
          
        <Flex wrap="wrap" justifyContent="center" alignItems="start" p={5} m="0 auto">
          {filteredEvents.map((event) => (
            <Box 
              key={event.id}
              bg="gray.200"
              p={5}
              borderRadius="md"
              m={4}
              width={['100%', '45%', '30%']}
              flexDirection="column"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text mt="2">Created By: {userLookup[event.createdBy]?.name || 'Unknown'}</Text>
              <Image
                src={userLookup[event.createdBy]?.image || ''}
                alt={`Created By: ${userLookup[event.createdBy]?.name || 'Unknown'}`}
                boxSize="50px"
                mt="2"
                borderRadius="full" 
              />
              <Link to={`/event/${event.id}`}>
                <Heading as="h2" size="md" bg="red.500" color="white" p={2} borderRadius="md" textAlign="center">Title: {event.title}</Heading>
              </Link>
              <Text mt="2" textAlign="center">Description: {event.description}</Text>
              <Image src={event.image} boxSize="150px" objectFit="cover" alt={`Event: ${event.title}`} mt="2" />
              <Text mt="2" textAlign="center">Location: {event.location}</Text>
              <Text textAlign="center">Start Time: {event.startTime}</Text>
              <Text textAlign="center">End Time: {event.endTime}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
      <AddEventForm
        isOpen={showAddEventModal}
        onClose={handleCloseAddEventModal}
        onSubmit={handleAddEvent}
        events={events}
        updateEvents={updateEvents}
        users={users}
        updateUsers={setUsers}
      />
    </VStack>
  );
  
          }
  export default EventsPage;
  