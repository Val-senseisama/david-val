import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBars, FaTimes, FaArrowLeft, FaDatabase, FaChartBar, FaUsers, FaBoxes, FaTruck, FaCog, FaSun, FaMoon, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Inventory.css';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface SummaryCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory_products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Handle mobile sidebar close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const sidebarToggle = document.querySelector('.sidebar-toggle');
      
      if (sidebar && sidebarToggle && window.innerWidth <= 768) {
        const target = event.target as Element;
        if (!sidebar.contains(target) && !sidebarToggle.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar when navigating to different pages on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [activePage]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    const newProduct: Product = {
      id: editingProduct?.id || generateId(),
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price)
    };

    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      // Add new product
      setProducts([...products, newProduct]);
    }

    // Reset form and close modal
    setFormData({ name: '', category: '', quantity: '', price: '' });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity.toString(),
      price: product.price.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', quantity: '', price: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', quantity: '', price: '' });
  };

  // Calculate summary data
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  const lowStock = products.filter(product => product.quantity < 10).length;
  const categories = [...new Set(products.map(product => product.category))].length;

  const summaryCards: SummaryCard[] = [
    {
      title: 'Total Products',
      value: totalProducts,
      change: '+12% from last month',
      icon: <FaBoxes />,
      color: '#007bff'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      change: '+8% from last month',
      icon: <FaChartBar />,
      color: '#0056b3'
    },
    {
      title: 'Low Stock Items',
      value: lowStock,
      change: '-3% from last month',
      icon: <FaEye />,
      color: '#004085'
    },
    {
      title: 'Categories',
      value: categories,
      change: '+2 from last month',
      icon: <FaDatabase />,
      color: '#002752'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'products', label: 'Products', icon: <FaBoxes /> },
    { id: 'customers', label: 'Customers', icon: <FaUsers /> },
    { id: 'orders', label: 'Orders', icon: <FaTruck /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="summary-cards">
        {summaryCards.map((card, index) => (
          <div key={index} className="summary-card" style={{ borderLeftColor: card.color }}>
            <div className="card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <div className="card-value">{card.value}</div>
              <div className="card-change">{card.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-placeholder">
            <div className="chart-bar" style={{ height: '60%', backgroundColor: '#007bff' }}></div>
            <div className="chart-bar" style={{ height: '80%', backgroundColor: '#0056b3' }}></div>
            <div className="chart-bar" style={{ height: '40%', backgroundColor: '#004085' }}></div>
            <div className="chart-bar" style={{ height: '70%', backgroundColor: '#002752' }}></div>
            <div className="chart-bar" style={{ height: '50%', backgroundColor: '#001a3a' }}></div>
          </div>
          <div className="chart-labels">
            <span>Electronics</span>
            <span>Clothing</span>
            <span>Books</span>
            <span>Home</span>
            <span>Sports</span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Stock Levels</h3>
          <div className="stock-chart">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id + index} className="stock-item">
                <div className="stock-label">{product.name}</div>
                <div className="stock-bar">
                  <div 
                    className="stock-fill" 
                    style={{ 
                      width: `${Math.min((product.quantity / 100) * 100, 100)}%`,
                      backgroundColor: product.quantity < 10 ? '#002752' : product.quantity < 50 ? '#004085' : '#007bff'
                    }}
                  ></div>
                </div>
                <div className="stock-value">{product.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <>
      <div className="search-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found. Add your first product to get started!</p>
          </div>
        )}
      </div>
    </>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      default:
        return (
          <div className="page-placeholder">
            <h2>{sidebarItems.find(item => item.id === activePage)?.label}</h2>
            <p>This page is under development. Coming soon!</p>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Inventory Management System | ValTech</title>
        <meta name="description" content="Comprehensive inventory management system with real-time tracking, analytics, and reporting. Manage products, track stock levels, and optimize your inventory." />
        <meta name="keywords" content="Inventory Management, Stock Tracking, Product Management, Inventory System, Warehouse Management, Stock Control" />
        <meta name="author" content="David Uyi Val-Izevbigie" />
        <meta property="og:title" content="Inventory Management System | ValTech" />
        <meta property="og:description" content="Comprehensive inventory management system with real-time tracking, analytics, and reporting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://david-val.vercel.app/inventory" />
        <meta property="og:image" content="https://david-val.vercel.app/inventory-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inventory Management System | ValTech" />
        <meta name="twitter:description" content="Comprehensive inventory management system with real-time tracking, analytics, and reporting." />
        <link rel="canonical" href="https://david-val.vercel.app/inventory" />
      </Helmet>
      <div className={`inventory-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Inventory Dashboard</h3>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/')}
            style={{ marginRight: '1rem' }}
          >
            <FaArrowLeft />
            Back to Portfolio
          </button>
          <h1>{sidebarItems.find(item => item.id === activePage)?.label}</h1>
          {activePage === 'products' && (
            <button className="btn btn-primary" onClick={openAddModal}>
              <FaPlus />
              Add Product
            </button>
          )}
        </div>

        {/* Page Content */}
        {renderPageContent()}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
} 