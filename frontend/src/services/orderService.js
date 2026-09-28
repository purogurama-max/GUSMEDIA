const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchOrders(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/orders${query ? `?${query}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching orders from API:', error);
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function fetchOrderById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch order: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching order by id ${id}:`, error);
    return null;
  }
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export async function createOrderApi(orderData, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatusApi(id, status, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    return { success: false, message: error.message };
  }
}
