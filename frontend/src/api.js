// src/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';
const TOKEN_KEY = 'access_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getAuthHeaders() {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${API_BASE_URL}/api/products/?${query}`
    : `${API_BASE_URL}/api/products/`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching products: ${res.status}`);
  }
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}/`);
  if (!res.ok) {
    throw new Error(`Error fetching product ${id}: ${res.status}`);
  }
  return res.json();
}

// ---- AUTH ----

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Неверный логин или пароль');
  }

  return res.json(); // { access, refresh }
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/api/me/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('Не удалось получить пользователя');
  }

  return res.json(); // { id, username, email, is_staff }
}

// ---- ADMIN: создание товара ----
export async function createOrderFromCart(cartItems) {
  // cartItems: [{ product: {id, ...}, quantity }]
  const items_data = cartItems.map(i => ({
    product_id: i.product.id,
    quantity: i.quantity,
  }))

  const res = await fetch(`${API_BASE_URL}/api/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ items_data }),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Нужно войти в аккаунт')
    if (res.status === 403) throw new Error('Нет прав для оформления заказа')
    throw new Error(`Ошибка при оформлении заказа: ${res.status}`)
  }

  return res.json()
}


export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/api/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Нет прав для создания товара (нужен админ)');
    }
    throw new Error(`Ошибка при создании товара: ${res.status}`);
  }

  return res.json();
}
