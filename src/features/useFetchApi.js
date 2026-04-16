import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3002";

export function useFetchApi(baseUrl = API_BASE_URL) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET 
  async function getData(endpoint) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // POST
  async function postData(endpoint, payload) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create");
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // PUT 
  async function putData(endpoint, payload) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.status === 404) {
        console.warn(`Item not found: ${endpoint}`);
        return null;
      }
      if (!response.ok) throw new Error("Failed to update");
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // DELETE 
  async function deleteData(endpoint) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "DELETE"
      });
      if (response.status === 404) {
        console.warn(`Item not found: ${endpoint}`);
        return true; 
      }
      if (!response.ok) throw new Error("Failed to delete");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, getData, postData, putData, deleteData };
}
