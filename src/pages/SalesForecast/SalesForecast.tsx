import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUpload, FaDownload, FaChartBar, FaBars, FaTimes, FaArrowLeft, FaPlus, FaTrash, FaSun, FaMoon, FaFileCsv, FaDatabase, FaDollarSign, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './SalesForecast.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesData {
  id: string;
  month: string;
  sales: number;
}

interface SummaryCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export default function SalesForecast() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    month: '',
    sales: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('sales_forecast_data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSalesData(parsedData);
    }
  }, []);

  // Save data to localStorage whenever salesData changes
  useEffect(() => {
    localStorage.setItem('sales_forecast_data', JSON.stringify(salesData));
  }, [salesData]);

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
      const sidebar = document.querySelector('.analytics-sidebar');
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

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      //const headers = lines[0].split(',');
      
      const newData: SalesData[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          if (values.length >= 2) {
            newData.push({
              id: generateId(),
              month: values[0].trim(),
              sales: parseFloat(values[1].trim()) || 0
            });
          }
        }
      }
      
      setSalesData(newData);
      showToastMessage('CSV data imported successfully!');
    };
    reader.readAsText(file);
  };

  const importDemoData = () => {
    const demoData: SalesData[] = [
      { id: generateId(), month: 'Jan', sales: 12000 },
      { id: generateId(), month: 'Feb', sales: 14500 },
      { id: generateId(), month: 'Mar', sales: 9800 },
      { id: generateId(), month: 'Apr', sales: 16500 },
      { id: generateId(), month: 'May', sales: 13200 },
      { id: generateId(), month: 'Jun', sales: 18900 },
      { id: generateId(), month: 'Jul', sales: 15600 },
      { id: generateId(), month: 'Aug', sales: 17800 },
      { id: generateId(), month: 'Sep', sales: 14200 },
      { id: generateId(), month: 'Oct', sales: 20100 },
      { id: generateId(), month: 'Nov', sales: 16800 },
      { id: generateId(), month: 'Dec', sales: 22500 }
    ];
    setSalesData(demoData);
    showToastMessage('Demo data imported successfully!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.month || !formData.sales) {
      showToastMessage('Please fill in all fields');
      return;
    }

    const newData: SalesData = {
      id: generateId(),
      month: formData.month,
      sales: parseFloat(formData.sales)
    };

    setSalesData([...salesData, newData]);
    setFormData({ month: '', sales: '' });
    showToastMessage('Sales data added successfully!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this data point?')) {
      setSalesData(salesData.filter(item => item.id !== id));
      showToastMessage('Data point deleted successfully!');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setSalesData([]);
      showToastMessage('All data cleared successfully!');
    }
  };

  const downloadCSV = () => {
    if (salesData.length === 0) {
      showToastMessage('No data to download');
      return;
    }

    const csvContent = [
      'Month,Sales',
      ...salesData.map(item => `${item.month},${item.sales}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_forecast.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    showToastMessage('CSV downloaded successfully!');
  };

  // Calculate summary data
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const averageSales = salesData.length > 0 ? totalSales / salesData.length : 0;
  const maxSales = Math.max(...salesData.map(item => item.sales), 0);
  const growthRate = salesData.length >= 2 
    ? ((salesData[salesData.length - 1].sales - salesData[0].sales) / salesData[0].sales * 100).toFixed(1)
    : 0;

  const summaryCards: SummaryCard[] = [
    {
      title: 'Total Revenue',
      value: `$${totalSales.toLocaleString()}`,
      change: `${growthRate}% growth`,
      icon: <FaDollarSign />,
      color: '#374151',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    {
      title: 'Monthly Average',
      value: `$${averageSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: 'Per month',
      icon: <FaChartLine />,
      color: '#374151',
      gradient: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
    },
    {
      title: 'Peak Performance',
      value: `$${maxSales.toLocaleString()}`,
      change: 'Best month',
      icon: <FaChartLine />,
      color: '#374151',
      gradient: 'linear-gradient(135deg, #fefefe 0%, #e5e7eb 100%)'
    },
    {
      title: 'Data Period',
      value: salesData.length,
      change: 'Months tracked',
      icon: <FaCalendarAlt />,
      color: '#374151',
      gradient: 'linear-gradient(135deg, #f9fafb 0%, #d1d5db 100%)'
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'data', label: 'Data Management', icon: <FaDatabase /> },
    { id: 'insights', label: 'Insights', icon: <FaChartLine /> },
    { id: 'reports', label: 'Reports', icon: <FaChartLine /> }
  ];

  // Chart configuration
  const chartData = {
    labels: salesData.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(item => item.sales),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 4,
        fill: true,
        tension: 0.6,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        titleColor: darkMode ? '#f3f4f6' : '#111827',
        bodyColor: darkMode ? '#f3f4f6' : '#111827',
        borderColor: '#10b981',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Revenue: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '600' as const
          }
        }
      },
      y: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 12,
            weight: '600' as const
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const renderDashboard = () => (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Sales Analytics Dashboard</h2>
        <p>Comprehensive insights into your sales performance and forecasting</p>
      </div>

      <div className="metrics-grid">
        {summaryCards.map((card, index) => (
          <div key={index} className="metric-card" style={{ background: card.gradient }}>
            <div className="metric-icon">
              {card.icon}
            </div>
            <div className="metric-content">
              <h3>{card.title}</h3>
              <div className="metric-value">{card.value}</div>
              <div className="metric-change">{card.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Revenue Trend Analysis</h3>
              <p>Monthly sales performance and growth patterns</p>
            </div>
            <div className="chart-controls">
              <button className="control-btn" onClick={downloadCSV}>
                <FaDownload />
                Export
              </button>
              <button className="control-btn danger" onClick={clearData}>
                <FaTrash />
                Clear
              </button>
            </div>
          </div>
          <div className="chart-container">
            {salesData.length > 0 ? (
              <Line data={chartData} options={chartOptions as any} />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaChartBar />
                </div>
                <h3>No Data Available</h3>
                <p>Import your sales data to start analyzing trends and forecasting</p>
                <button className="btn-primary" onClick={importDemoData}>
                  <FaDatabase />
                  Load Sample Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataInput = () => (
    <div className="data-management">
      <div className="page-header">
        <h2>Data Management</h2>
        <p>Import, manage, and organize your sales data</p>
      </div>

      <div className="data-sections">
        <div className="import-section">
          <div className="section-card">
            <h3>Data Import</h3>
            <div className="import-options">
              <button 
                className="import-btn primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload />
                Upload CSV File
              </button>
              <button 
                className="import-btn secondary"
                onClick={importDemoData}
              >
                <FaDatabase />
                Load Demo Data
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div className="import-hint">
              <FaFileCsv />
              <span>CSV format: Month,Sales (e.g., Jan,12000)</span>
            </div>
          </div>
        </div>

        <div className="manual-input-section">
          <div className="section-card">
            <h3>Add Data Point</h3>
            <form onSubmit={handleSubmit} className="data-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="month">Month</label>
                  <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Month</option>
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="sales">Revenue ($)</label>
                  <input
                    type="number"
                    id="sales"
                    name="sales"
                    value={formData.sales}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                    className="form-input"
                    placeholder="Enter revenue amount"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <FaPlus />
                Add Data Point
              </button>
            </form>
          </div>
        </div>

        <div className="data-table-section">
          <div className="section-card">
            <div className="table-header">
              <h3>Sales Data</h3>
              <span className="data-count">{salesData.length} records</span>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map(item => (
                    <tr key={item.id}>
                      <td>{item.month}</td>
                      <td className="revenue-cell">${item.sales.toLocaleString()}</td>
                      <td>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {salesData.length === 0 && (
                <div className="empty-table">
                  <FaDatabase />
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      case 'data':
        return renderDataInput();
      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <h2>{sidebarItems.find(item => item.id === activePage)?.label}</h2>
              <p>This feature is coming soon! We're working hard to bring you more analytics capabilities.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Sales Forecasting & Analytics | ValTech</title>
        <meta name="description" content="Advanced sales forecasting and analytics platform. Analyze sales trends, predict future performance, and make data-driven business decisions with interactive charts and reports." />
        <meta name="keywords" content="Sales Forecasting, Business Analytics, Sales Analytics, Data Visualization, Business Intelligence, Sales Trends, Revenue Prediction" />
        <meta name="author" content="David Uyi Val-Izevbigie" />
        <meta property="og:title" content="Sales Forecasting & Analytics | ValTech" />
        <meta property="og:description" content="Advanced sales forecasting and analytics platform with interactive charts and reports." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://david-val.vercel.app/sales-forecast" />
        <meta property="og:image" content="https://david-val.vercel.app/sales-forecast-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sales Forecasting & Analytics | ValTech" />
        <meta name="twitter:description" content="Advanced sales forecasting and analytics platform with interactive charts and reports." />
        <link rel="canonical" href="https://david-val.vercel.app/sales-forecast" />
      </Helmet>
      <div className={`sales-analytics ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`analytics-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaChartBar />
            <span>Analytics Pro</span>
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
        <div className="analytics-topbar">
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
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="content-area">
          {renderPageContent()}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
    </>
  );
} 