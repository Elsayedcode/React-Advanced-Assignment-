import React from 'react';
import { Box, Flex, Spacer, List, ListItem, Link, Text } from '@chakra-ui/react';

function Navigation() {
  return (
    <Box bg="red.500" p={3}>
      <Flex align="center">
        <Text color="white" fontSize="xl" fontWeight="bold">
          EventApp
        </Text> 
        <Spacer />
        <List display="flex" listStyleType="none" gap="3">
          <ListItem>
            <Link href="/" color="white" p={2} borderRadius="md" _hover={{ backgroundColor: 'white', color: 'red.500' }}>
              Home
            </Link>
          </ListItem>
          
        </List>
      </Flex>
    </Box>
  );
}

export default Navigation;
