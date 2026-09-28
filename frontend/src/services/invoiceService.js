const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchInvoices(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/invoices${query ? `?${query}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch invoices: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching invoices from API:', error);
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function fetchInvoiceById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/invoices/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch invoice: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching invoice by id ${id}:`, error);
    return null;
  }
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export async function createInvoiceFromOrderApi(orderId, dueDays = 30, notes = '', customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ order_id: orderId, due_days: dueDays, notes }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return { success: false, message: error.message };
  }
}

export async function updateInvoiceStatusApi(id, paymentStatus, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/invoices/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ payment_status: paymentStatus }),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error updating payment status for invoice ${id}:`, error);
    return { success: false, message: error.message };
  }
}
