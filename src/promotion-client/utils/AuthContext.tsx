import React, { createContext, useState, useContext, useEffect } from "react";

// Define the shape of the authentication data
interface AuthData {
  [accountId: string]: {
    loggedIn: boolean;
    userId?: string;
    registered?: boolean;
    token?: string;
    clientId?: string;
  };
}

// Define the context type
interface AuthContextType {
  authData: AuthData;
  login: (accountId: string, userId?: string, token?: string, clientId?: string) => void;
  logout: (accountId: string) => void;
  isLoggedInForAccount: (accountId: string) => boolean;
  registerAccount: (accountId: string, userId?: string) => void;
  isRegisteredForAccount: (accountId: string) => boolean;
  getClientId: (accountId: string) => string | undefined;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>(() => {
    const storedAuthData = localStorage.getItem("globalAuthData");
    return storedAuthData ? JSON.parse(storedAuthData) : {};
  });

  useEffect(() => {
    console.log("Full AuthData Update:", authData);
    localStorage.setItem("globalAuthData", JSON.stringify(authData));
  }, [authData]);

  const login = (accountId: string, userId?: string, token?: string, clientId?: string) => {
    // Add validation to ensure accountId is not empty
    if (!accountId) {
      console.error("Login attempted with empty accountId");
      return;
    }

    console.log("Login Attempt Details:", {
      accountId,
      userId,
      token,
      clientId,
    });

    setAuthData((prevData) => {
      const updatedData = {
        ...prevData,
        [accountId]: {
          loggedIn: true,
          userId: userId || prevData[accountId]?.userId,
          token: token || prevData[accountId]?.token,
          clientId: clientId || prevData[accountId]?.clientId,
          registered: true,
        },
      };

      console.log("Updated AuthData for AccountId:", accountId);
      console.log("Updated Entry:", updatedData[accountId]);

      return updatedData;
    });
  };

  const logout = (accountId: string) => {
    setAuthData((prevData) => {
      const updatedData = {
        ...prevData,
        [accountId]: {
          ...prevData[accountId],
          loggedIn: false,
          userId: undefined,
          token: undefined,
          clientId: undefined, // Clear clientId on logout
        },
      };
      return updatedData;
    });
  };

  const isLoggedInForAccount = (accountId: string) => {
    return !!authData[accountId]?.loggedIn;
  };

  const registerAccount = (accountId: string, userId?: string) => {
    setAuthData((prevData) => {
      const updatedData = {
        ...prevData,
        [accountId]: {
          ...prevData[accountId],
          registered: true,
          userId,
        },
      };
      return updatedData;
    });
  };

  const isRegisteredForAccount = (accountId: string) => {
    return !!authData[accountId]?.registered;
  };
  const getClientId = (accountId: string): string | undefined => {
    const accountData = authData[accountId];
    if (accountData) {
      return accountData.clientId; // Accede correctamente al clientId
    }
    return undefined;
  };
  // Function to get clientId for a specific account

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        logout,
        isLoggedInForAccount,
        registerAccount,
        isRegisteredForAccount,
        getClientId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
