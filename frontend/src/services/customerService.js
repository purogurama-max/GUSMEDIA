const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchCustomers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/customers${query ? `?${query}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch customers: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching customers from API:', error);
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function fetchCustomerById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch customer: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching customer by id ${id}:`, error);
    return null;
  }
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export async function createCustomerApi(customerData, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(customerData),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, message: error.message };
  }
}

export async function updateCustomerApi(id, customerData, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(customerData),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    return { success: false, message: error.message };
  }
}

export async function deleteCustomerApi(id, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    return { success: false, message: error.message };
  }
}
