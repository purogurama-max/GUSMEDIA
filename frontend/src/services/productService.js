const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const formatCurrency = (amount) => {
  const number = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
};

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/products${query ? `?${query}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error fetching products from API:', error);
    return { success: false, data: [], meta: { total: 0 } };
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export async function createProductApi(productData, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(productData),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: error.message };
  }
}

export async function updateProductApi(id, productData, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(productData),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return { success: false, message: error.message };
  }
}

export async function deleteProductApi(id, customToken) {
  try {
    const token = customToken || getToken();
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return { success: false, message: error.message };
  }
}
