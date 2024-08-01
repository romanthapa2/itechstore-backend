import 'dotenv/config';
import fetch from 'node-fetch';

// URL of your backend service
const BACKEND_URL = process.env.BACKEND_URL;

async function invokeBackend() {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    console.log('Backend invoked successfully:', data);
  } catch (error) {
    console.error('Error invoking backend:', error);
  }
}

// Invoke the backend
invokeBackend();
