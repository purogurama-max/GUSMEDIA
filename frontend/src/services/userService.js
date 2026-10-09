import { getAdminToken, logoutAdmin } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

const handleUnauthorized = (res, data) => {
  if (res.status === 401 || data?.message === 'Invalid or expired token.') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login?expired=1';
    }
  }
};

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    handleUnauthorized(res, data);
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Gagal mengambil data user' };
  }
}

export async function createUserApi(userData) {
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    handleUnauthorized(res, data);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Gagal membuat user baru' };
  }
}

export async function updateUserStatusApi(userId, isActive) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: isActive }),
    });
    const data = await res.json();
    handleUnauthorized(res, data);
    return data;
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, message: 'Gagal mengubah status user' };
  }
}

export async function updateUserApi(userId, userData) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    handleUnauthorized(res, data);
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Gagal memperbarui data user' };
  }
}

export async function deleteUserApi(userId) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    handleUnauthorized(res, data);
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Gagal menghapus user' };
  }
}
