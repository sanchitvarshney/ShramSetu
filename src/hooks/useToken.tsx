import {  useState } from 'react';

// Define the type for the userToken object
interface UserToken {
  token: string | null;
}

// Define the return type for the hook
interface UseToken {
  setToken: (userToken: UserToken) => void;
  token: string | null;
}

export default function useToken(): UseToken {
  // Function to retrieve the token from localStorage
  const getToken = (): string | null => {
    try {
      // Retrieve the 'loggedInUser' string from localStorage
      const loggedInUserString = localStorage.getItem('loggedInUser');
      if (!loggedInUserString) {
        return null;
      }

      // Parse the string as JSON
      const loggedInUser = JSON.parse(loggedInUserString);

      // Extract the token from the parsed object
      return loggedInUser?.token || null;
    } catch (error) {
      console.error("Failed to retrieve token from localStorage", error);
      return null;
    }
  };

  // Initialize state with the token from localStorage
  const [token, setToken] = useState<string | null>(getToken());

  

  // Function to save the token to localStorage
  const saveToken = (userToken: UserToken): void => {
    try {
      // Retrieve current 'loggedInUser' string
      const loggedInUserString = localStorage.getItem('loggedInUser');
      if (loggedInUserString) {
        // Parse the current 'loggedInUser' string as JSON
        const loggedInUser = JSON.parse(loggedInUserString);

        // Update the token in the parsed object
        loggedInUser.token = userToken.token || null;

        // Save the updated object back to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      }
      
      // Update state with the new token
      setToken(userToken.token);
    } catch (error) {
      console.error("Failed to save token to localStorage", error);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}
