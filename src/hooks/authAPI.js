import { useState } from 'react';

export function useAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authHeader, setAuthHeader] = useState(null);

  const fetchData = async (url, options = {}) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: authHeader,
        },
      });

      const json = await response.json();
      setData(json);
      setLoading(false);
      return { data: json, response };
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      return { error };
    }
  };

  const api = {
    data,
    loading,
    error,
    authHeader,
    setAuthHeader,
    fetchData,
  };

  return api;
}
