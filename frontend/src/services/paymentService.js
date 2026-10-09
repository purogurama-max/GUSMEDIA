const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export async function createPaymentApi(data, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, message: error.message };
  }
}

export async function fetchPaymentHistory(invoiceId) {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/history/${invoiceId}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch payment history: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching payment history for invoice ${invoiceId}:`, error);
    return null;
  }
}

export async function fetchPayments(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/payments${query ? `?${query}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch payments: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { success: false, data: [], meta: { total: 0 } };
  }
}
