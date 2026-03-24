// warehouse.js
document.addEventListener('DOMContentLoaded', () => {
  fetchWarehouseDetails();
  fetchCategories();
});

const getAuthToken = () => {
  return sessionStorage.getItem('admin_token');
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  };
};

const BASE_URL = 'http://localhost:3500';

async function fetchWarehouseDetails() {
  const container = document.getElementById('warehouseContainer');
  try {
    const response = await fetch(`${BASE_URL}/api/warehouse`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch warehouse data');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      // Display the first warehouse (or all of them if desired)
      renderWarehouses(data, container);
    } else {
      container.innerHTML = '<div class="no-data">No warehouse details found.</div>';
    }
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = '<div class="error-msg">Error loading warehouse details.</div>';
  }
}

function renderWarehouses(warehouses, container) {
  let html = '';
  warehouses.forEach(wh => {
    html += `
      <div class="warehouse-card">
        <div class="wh-row">
          <div class="wh-icon">📍</div>
          <div class="wh-info">
            <span class="wh-label">Address</span>
            <span class="wh-value">${wh.address || 'N/A'}</span>
          </div>
        </div>
        <div class="wh-row">
          <div class="wh-icon">📦</div>
          <div class="wh-info">
            <span class="wh-label">Total Capacity</span>
            <span class="wh-value">${wh.total_capacity ? wh.total_capacity + ' kgs' : 'N/A'}</span>
          </div>
        </div>
        <div class="wh-row">
          <div class="wh-icon">📐</div>
          <div class="wh-info">
            <span class="wh-label">Total Area</span>
            <span class="wh-value">${wh.total_area ? wh.total_area + ' sq.ft' : 'N/A'}</span>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

async function fetchCategories() {
  const container = document.getElementById('categoriesContainer');
  try {
    const response = await fetch(`${BASE_URL}/api/category`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      renderCategories(data, container);
    } else {
      container.innerHTML = '<div class="no-data">No categories found.</div>';
    }
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = '<div class="error-msg">Error loading categories.</div>';
  }
}

function renderCategories(categories, container) {
  let html = '';
  categories.forEach((cat, index) => {
    const delay = index * 0.1; // Staggered animation
    html += `
      <div class="category-card" style="animation-delay: ${delay}s">
        <div class="cat-header">
          <div class="cat-title">${cat.category_name}</div>
          <div class="cat-badge">Active</div>
        </div>
        <div class="cat-desc">${cat.description || 'No description available for this category.'}</div>
        <div class="cat-footer">
          <div class="cat-price">₹${cat.rate_per_kg} / kg</div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
