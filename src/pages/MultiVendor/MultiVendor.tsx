import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaTrash, FaBars, FaTimes, FaArrowLeft, FaSun, FaMoon, FaShoppingCart, FaCreditCard, FaCalculator, FaHistory,  FaStore, FaChartPie, FaReceipt, FaMoneyBillWave, FaPercent } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MultiVendor.css';

interface Product {
  id: string;
  name: string;
  vendor: string;
  price: number;
}

interface CheckoutSession {
  id: string;
  timestamp: string;
  products: Product[];
  subtotal: number;
  platformFee: number;
  vat: number;
  total: number;
  vendorPayouts: { vendor: string; amount: number }[];
}

interface SummaryCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function MultiVendor() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('checkout');
  const [showSummary, setShowSummary] = useState(false);
  const [checkoutHistory, setCheckoutHistory] = useState<CheckoutSession[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    price: ''
  });

  // Constants for calculations
  const PLATFORM_FEE_RATE = 0.05; // 5%
  const VAT_RATE = 0.075; // 7.5%

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('multivendor_history');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setCheckoutHistory(parsedHistory);
    }
  }, []);

  // Save checkout history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('multivendor_history', JSON.stringify(checkoutHistory));
  }, [checkoutHistory]);

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
      const sidebar = document.querySelector('.payment-sidebar');
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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.vendor || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    const newProduct: Product = {
      id: generateId(),
      name: formData.name,
      vendor: formData.vendor,
      price: parseFloat(formData.price)
    };

    setProducts([...products, newProduct]);
    setFormData({ name: '', vendor: '', price: '' });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCheckout = () => {
    if (products.length === 0) {
      alert('Please add at least one product to checkout');
      return;
    }

    const subtotal = products.reduce((sum, product) => sum + product.price, 0);
    const platformFee = subtotal * PLATFORM_FEE_RATE;
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;

    // Calculate vendor payouts
    const vendorPayouts = products.reduce((acc, product) => {
      const existingVendor = acc.find(v => v.vendor === product.vendor);
      if (existingVendor) {
        existingVendor.amount += product.price - (product.price * PLATFORM_FEE_RATE);
      } else {
        acc.push({
          vendor: product.vendor,
          amount: product.price - (product.price * PLATFORM_FEE_RATE)
        });
      }
      return acc;
    }, [] as { vendor: string; amount: number }[]);

    const session: CheckoutSession = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      products: [...products],
      subtotal,
      platformFee,
      vat,
      total,
      vendorPayouts
    };

    setCheckoutHistory([session, ...checkoutHistory.slice(0, 2)]); // Keep last 3 sessions
    setShowSummary(true);
  };

  const resetCart = () => {
    setProducts([]);
    setShowSummary(false);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all checkout history?')) {
      setCheckoutHistory([]);
    }
  };

  // Calculate summary data
  const totalSessions = checkoutHistory.length;
  const totalRevenue = checkoutHistory.reduce((sum, session) => sum + session.total, 0);
  const totalPlatformFees = checkoutHistory.reduce((sum, session) => sum + session.platformFee, 0);
  const totalVAT = checkoutHistory.reduce((sum, session) => sum + session.vat, 0);

  const summaryCards: SummaryCard[] = [
    {
      title: 'Total Sessions',
      value: totalSessions.toString(),
      subtitle: 'Checkout transactions',
      icon: <FaReceipt />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
    },
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      subtitle: 'Gross revenue collected',
      icon: <FaMoneyBillWave />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
    },
    {
      title: 'Platform Fees',
      value: `₦${totalPlatformFees.toLocaleString()}`,
      subtitle: '5% platform commission',
      icon: <FaPercent />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
    },
    {
      title: 'VAT Collected',
      value: `₦${totalVAT.toLocaleString()}`,
      subtitle: '7.5% tax revenue',
      icon: <FaCalculator />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)'
    }
  ];

  const sidebarItems = [
    { id: 'checkout', label: 'Checkout', icon: <FaShoppingCart /> },
    { id: 'history', label: 'History', icon: <FaHistory /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartPie /> },
    { id: 'vendors', label: 'Vendors', icon: <FaStore /> }
  ];

  const renderCheckout = () => (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Multi-Vendor Checkout</h2>
        <p>Add products from different vendors and calculate payment splits</p>
      </div>

      <div className="checkout-content">
        <div className="product-entry-section">
          <div className="section-card">
            <h3>Add Product</h3>
            <form onSubmit={handleAddProduct} className="product-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="vendor">Vendor Name</label>
                  <input
                    type="text"
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="price">Price (₦)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                    className="form-input"
                    placeholder="Enter price"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <FaPlus />
                Add Product
              </button>
            </form>
          </div>
        </div>

        <div className="cart-section">
          <div className="section-card">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <span className="cart-count">{products.length} items</span>
            </div>
            
            {products.length > 0 ? (
              <div className="cart-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Vendor</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.vendor}</td>
                        <td className="price-cell">₦{product.price.toLocaleString()}</td>
                        <td>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-cart">
                <FaShoppingCart />
                <p>Your cart is empty. Add products to get started!</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="cart-actions">
                <button className="btn-secondary" onClick={resetCart}>
                  Clear Cart
                </button>
                <button className="btn-primary" onClick={calculateCheckout}>
                  <FaCalculator />
                  Calculate Checkout
                </button>
              </div>
            )}
          </div>
        </div>

        {showSummary && products.length > 0 && (
          <div className="summary-section">
            <div className="section-card summary-card">
              <h3>Payment Breakdown</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Subtotal:</span>
                  <span className="value">₦{products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Platform Fee (5%):</span>
                  <span className="value">₦{(products.reduce((sum, p) => sum + p.price, 0) * PLATFORM_FEE_RATE).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">VAT (7.5%):</span>
                  <span className="value">₦{(products.reduce((sum, p) => sum + p.price, 0) * VAT_RATE).toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                  <span className="label">Total Payable:</span>
                  <span className="value">₦{(products.reduce((sum, p) => sum + p.price, 0) * (1 + VAT_RATE)).toFixed(2)}</span>
                </div>
              </div>

              <div className="vendor-payouts">
                <h4>Vendor Payouts</h4>
                {products.reduce((acc, product) => {
                  const existingVendor = acc.find(v => v.vendor === product.vendor);
                  if (existingVendor) {
                    existingVendor.amount += product.price - (product.price * PLATFORM_FEE_RATE);
                  } else {
                    acc.push({
                      vendor: product.vendor,
                      amount: product.price - (product.price * PLATFORM_FEE_RATE)
                    });
                  }
                  return acc;
                }, [] as { vendor: string; amount: number }[]).map((payout, index) => (
                  <div key={index} className="payout-item">
                    <span className="vendor-name">{payout.vendor}</span>
                    <span className="payout-amount">₦{payout.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-actions">
                <button className="btn-secondary" onClick={resetCart}>
                  New Checkout
                </button>
                <button className="btn-primary" onClick={() => setShowSummary(false)}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="history-container">
      <div className="history-header">
        <h2>Checkout History</h2>
        <p>Recent payment sessions and transaction details</p>
      </div>

      {checkoutHistory.length > 0 ? (
        <div className="history-grid">
          {checkoutHistory.map(session => (
            <div key={session.id} className="history-card">
              <div className="history-card-header">
                <div className="session-info">
                  <h3>Session #{session.id.slice(-6)}</h3>
                  <span className="session-date">
                    {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="session-total">
                  ₦{session.total.toFixed(2)}
                </div>
              </div>

              <div className="session-breakdown">
                <div className="breakdown-item">
                  <span>Subtotal:</span>
                  <span>₦{session.subtotal.toFixed(2)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Platform Fee:</span>
                  <span>₦{session.platformFee.toFixed(2)}</span>
                </div>
                <div className="breakdown-item">
                  <span>VAT:</span>
                  <span>₦{session.vat.toFixed(2)}</span>
                </div>
              </div>

              <div className="session-products">
                <h4>Products ({session.products.length})</h4>
                <div className="product-list">
                  {session.products.map(product => (
                    <div key={product.id} className="product-item">
                      <span className="product-name">{product.name}</span>
                      <span className="product-vendor">{product.vendor}</span>
                      <span className="product-price">₦{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="session-vendors">
                <h4>Vendor Payouts</h4>
                <div className="vendor-list">
                  {session.vendorPayouts.map((payout, index) => (
                    <div key={index} className="vendor-item">
                      <span className="vendor-name">{payout.vendor}</span>
                      <span className="vendor-amount">₦{payout.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-history">
          <FaHistory />
          <h3>No Checkout History</h3>
          <p>Complete your first checkout to see transaction history here.</p>
        </div>
      )}

      {checkoutHistory.length > 0 && (
        <div className="history-actions">
          <button className="btn-secondary" onClick={clearHistory}>
            Clear History
          </button>
        </div>
      )}
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'checkout':
        return renderCheckout();
      case 'history':
        return renderHistory();
      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <h2>{sidebarItems.find(item => item.id === activePage)?.label}</h2>
              <p>This feature is coming soon! We're working hard to bring you more payment analytics.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Multi-Vendor Marketplace | ValTech</title>
        <meta name="description" content="Multi-vendor marketplace platform with automated checkout, vendor payouts, and transaction management. Handle multiple vendors, calculate fees, and manage payments seamlessly." />
        <meta name="keywords" content="Multi-Vendor Marketplace, E-commerce Platform, Vendor Management, Payment Processing, Transaction Management, Marketplace Solution" />
        <meta name="author" content="David Uyi Val-Izevbigie" />
        <meta property="og:title" content="Multi-Vendor Marketplace | ValTech" />
        <meta property="og:description" content="Multi-vendor marketplace platform with automated checkout and vendor payouts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://david-val.vercel.app/multivendor" />
        <meta property="og:image" content="https://david-val.vercel.app/multivendor-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Multi-Vendor Marketplace | ValTech" />
        <meta name="twitter:description" content="Multi-vendor marketplace platform with automated checkout and vendor payouts." />
        <link rel="canonical" href="https://david-val.vercel.app/multivendor" />
      </Helmet>
      <div className={`payment-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`payment-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaCreditCard />
            <span>Payment Pro</span>
          </div>
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
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="payment-topbar">
          <div className="topbar-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              <FaArrowLeft />
              Back to Portfolio
            </button>
          </div>
          <div className="topbar-center">
            <h1>{sidebarItems.find(item => item.id === activePage)?.label}</h1>
          </div>
          <div className="topbar-right">
            <div className="user-info">
              <span>Multi-Vendor Payments</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-section">
          <div className="summary-grid">
            {summaryCards.map((card, index) => (
              <div key={index} className="summary-card" style={{ background: card.gradient }}>
                <div className="card-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <div className="card-value">{card.value}</div>
                  <div className="card-subtitle">{card.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <div className="content-area">
          {renderPageContent()}
        </div>
      </div>
    </div>
    </>
  );
} 