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

  

  // Function to save the token to localStorage (or clear it when userToken.token is null)
  const saveToken = (userToken: UserToken): void => {
    try {
      const loggedInUserString = localStorage.getItem('loggedInUser');
      if (loggedInUserString) {
        const loggedInUser = JSON.parse(loggedInUserString);
        loggedInUser.token = userToken.token || null;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      }
    } catch (error) {
      console.error("Failed to save token to localStorage", error);
    }
    // Always update in-memory token (e.g. so logout clears state even if localStorage was already cleared)
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
