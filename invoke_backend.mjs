import 'dotenv/config';
import fetch from 'node-fetch';

async function invokeBackend() {
  try {
    const response = await fetch("https://shoponline-backend.onrender.com/api/filter/dataByType?type=Monitors");
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
