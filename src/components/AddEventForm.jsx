import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from '@chakra-ui/react';

function AddEventForm({ isOpen, onClose, onSubmit, events, updateEvents, users, updateUsers }) {
  
  const [newEvent, setNewEvent] = useState({
    id: [],
    createdBy: '',
    title: '',
    description: '',
    categoryIds: [] ,
    image: '', 
    location: '',
    startTime: '',
    endTime: ''
  });

const [eventUploadedImage, setEventUploadedImage] = useState();
const [eventImageURL, setEventImageURL] = useState('');
const [userUploadedImage, setUserUploadedImage] = useState();
const [userImageURL, setUserImageURL] = useState('');

  const handleEventFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setEventUploadedImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleUserFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserUploadedImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setNewEvent((prevEvent) => ({
    ...prevEvent,
    [name]: value,
  }));
};


  const handleSubmit = () => {
    const eventFinalImage = eventUploadedImage ? eventUploadedImage : eventImageURL;
    const userFinalImage = userUploadedImage ? userUploadedImage : userImageURL;

    let userId = users.find(user => user.name === newEvent.createdBy)?.id;

    if (!userId) {
        const maxUserId = users.reduce((maxId, user) => Math.max(user.id, maxId), 0);
        userId = maxUserId + 1;

        const updatedUser = {
            id: userId,
            name: newEvent.createdBy,
            image: userFinalImage
        };
        updateUsers([...users, updatedUser]);
    }

    // Linking the event to the user ID
    newEvent.createdBy = userId;

    const updatedEvent = {
      ...newEvent,
      createdBy: newEvent.createdBy, // This will directly take the name entered by the user
      image: eventFinalImage
  };
  
  // Then, you can add the event to your list or save it, etc.
  onSubmit(updatedEvent);
  updateEvents([...events, updatedEvent]);
  onClose();
};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <FormControl>
    <FormLabel htmlFor="createdBy">Created By</FormLabel>
    <Input
      id="createdBy"
      type="text"
      name="createdBy"
      value={newEvent.createdBy}
      onChange={handleChange}
    />
</FormControl>

          <FormControl>
          <FormLabel>User Image (only if new user)</FormLabel>
          <Input type="file" onChange={handleUserFileInputChange} />
          <Input
        placeholder="Or provide user image URL"
        value={userImageURL}
        onChange={(e) => setUserImageURL(e.target.value)}
    />
</FormControl>
          <FormControl mb="4">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newEvent.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
    <FormLabel>Event Image</FormLabel>
    <Input type="file" onChange={handleEventFileInputChange} />
    <Input
        placeholder="Or provide event image URL"
        value={eventImageURL}
        onChange={(e) => setEventImageURL(e.target.value)}
    />
</FormControl>
          <FormControl mb="4">
            <FormLabel>Category</FormLabel>
            <Select
              name="categoryIds"
              multiple
              value={newEvent.categoryIds}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                const updatedEvent = { ...newEvent, categoryIds: selectedValues };
                // @ts-ignore
                setNewEvent(updatedEvent);
              }}
            >
              <option value="1">Sports</option>
              <option value="2">Games</option>
              <option value="3">Relaxation</option>
            </Select>
          </FormControl>
          <FormControl mb="4">
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={newEvent.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={newEvent.endTime}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleSubmit}>
            Add Event
          </Button>
          <Button colorScheme="red" mr={3} onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddEventForm;


