import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Box, Heading, Text, Image, AlertDialog,
  AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogBody, AlertDialogCloseButton,
  useDisclosure, Spinner, useToast, VStack
} from '@chakra-ui/react';

function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState([]);
  const [creator, setCreator] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/events/${id}`)
      .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to fetch the event.');
        }
        return response.json();
      })
      .then(data => {
        setEvent(data);
        if (data.createdBy) {
          return fetch(`http://localhost:3000/users/${data.createdBy}`);
        }
        return null;
      })
      .then(response => {
        if (response && !response.ok) {
            throw new Error('Failed to fetch the creator.');
        }
        return response?.json();
      })
      .then(creatorData => {
        if (creatorData) {
          setCreator(creatorData);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [id, toast]);

  const handleDelete = () => {
    fetch(`http://localhost:3000/events/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete the event.');
        }
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error);
        toast({
          title: "An error occurred.",
          description: "Failed to delete the event.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    onClose();
  };

  if (!event) {
    return <Spinner size="xl" />;
  }

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="calc(100vh - 2rem)" 
    my="5rem" 
    >
      {creator ? (
        <VStack
          bg="gray.200"
          p={5}
          borderRadius="md"
          width={['100%', '80%', '60%']}
          spacing={5} // added spacing for better presentation
        >
          <Button colorScheme="red" onClick={() => navigate('/')}>Home</Button>
          <Text mt="2">Created By: {creator.name}</Text>
          <Image src={creator.image} alt={`Created By: ${creator.name}`} boxSize="50px" />
          <Heading as="h2" size="md" bg="red.500" color="white" p={2} borderRadius="md">{event.title}</Heading>
          <Text>Description: {event.description}</Text>
          <Image src={event.image} alt={`Event: ${event.title}`} boxSize="150px" objectFit="cover" />
          <Text>Location: {event.location}</Text>
          <Text>Start Time: {event.startTime}</Text>
          <Text>End Time: {event.endTime}</Text>
          <Button colorScheme="red" onClick={onOpen}>Delete Event</Button>
        </VStack>
      ) : (
        <Text>Creator information not available</Text>
      )}
      
      
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete Event</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
   </Box>
  );
}

export default EventPage;