// src/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';

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
