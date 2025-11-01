/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

// Configuration
const BASE_URL = 'https://elderly-care-y6qb.onrender.com';
const TOKEN_KEY = 'auth-token';

// Create Context
export const ElderlyContext = createContext();

const ElderlyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from localStorage
  const getToken = () => localStorage.getItem(TOKEN_KEY);

  // Save token to localStorage
  const saveToken = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  // Fetch user credentials using token
  const fetchCredentials = async () => {
    const token = getToken();
    
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/credentials`, {
        method: 'GET',
        headers: {
          [TOKEN_KEY]: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const data = await response.json();

      if (data.success) {
        setUser({
          role: data.role,
          userName: data.userName,
        });
        setIsAuthenticated(true);
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Credentials fetch error:', err);
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    fetchCredentials();
  }, []);

  // Generic API fetch helper
  const apiFetch = async (endpoint, method = 'GET', body = null) => {
    const token = getToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers[TOKEN_KEY] = token;
    }

    const options = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error (${method} ${endpoint}):`, err);
      setError(err.message);
      throw err;
    }
  };

  // Authentication functions
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (!data.token) {
        throw new Error('No token received from server');
      }

      saveToken(data.token);
      await fetchCredentials();

      return data;
    } catch (err) {
      setError(err.message);
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      if (!data.token) {
        throw new Error('No token received from server');
      }

      saveToken(data.token);
      await fetchCredentials();

      return data;
    } catch (err) {
      setError(err.message);
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Data fetching functions
  const getCareTakers = async () => {
    try {
      const data = await apiFetch('/getcaretakers');
      return data.caretakers || [];
    } catch (err) {
      return [];
    }
  };

  const createRequest = async (requestData) => {
    return await apiFetch('/requests', 'POST', requestData);
  };

  const getRequests = async () => {
    try {
      const data = await apiFetch('/requests');
      return data.userRequest || [];
    } catch (err) {
      return [];
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    if (!['accepted', 'declined', 'denied', 'pending'].includes(status?.toLowerCase())) {
      throw new Error('Invalid status provided');
    }
    return await apiFetch(`/update-status/${requestId}`, 'PUT', { status });
  };

  const uploadFile = async (formData) => {
    try {
      setError(null);
      const token = getToken();
      
      const headers = {};
      if (token) {
        headers[TOKEN_KEY] = token;
      }

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
        }
        throw new Error(data.message || 'File upload failed');
      }

      return data.url;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addMetrics = async (metricsData) => {
    return await apiFetch('/addmetrics', 'POST', metricsData);
  };

  const getMetrics = async () => {
    try {
      const data = await apiFetch('/metrics');
      return data.metrics || [];
    } catch (err) {
      return [];
    }
  };

  const addTasks = async (taskData) => {
    return await apiFetch('/addtasks', 'POST', taskData);
  };

  const getTasks = async () => {
    try {
      const data = await apiFetch('/tasks');
      return data.tasks || [];
    } catch (err) {
      return [];
    }
  };

  const addMedication = async (medData) => {
    return await apiFetch('/addmedication', 'POST', medData);
  };

  const getMedication = async () => {
    try {
      const data = await apiFetch('/medication');
      return data.medication || [];
    } catch (err) {
      return [];
    }
  };

  const addContact = async (contactData) => {
    return await apiFetch('/addcontacts', 'POST', contactData);
  };

  const getContacts = async () => {
    try {
      const data = await apiFetch('/chat');
      return data.chat || [];
    } catch (err) {
      return [];
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    setError,
    signup,
    signin,
    logout,
    getCareTakers,
    createRequest,
    getRequests,
    updateRequestStatus,
    uploadFile,
    getMetrics,
    addMetrics,
    getTasks,
    addTasks,
    getMedication,
    addMedication,
    getContacts,
    addContact,
  };

  return (
    <ElderlyContext.Provider value={contextValue}>
      {children}
    </ElderlyContext.Provider>
  );
};

export default ElderlyProvider;
