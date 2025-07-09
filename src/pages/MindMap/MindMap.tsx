import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaBars, FaTimes, FaArrowLeft, FaSun, FaMoon, FaBrain, FaSearch, FaFilter, FaDownload, FaPalette } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MindMap.css';

interface MindMapNode {
  id: string;
  text: string;
  category: string;
  color: string;
  position: { x: number; y: number };
  createdAt: string;
}

interface SummaryCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const CATEGORIES = [
  { name: 'Ideas', color: '#3b82f6' },
  { name: 'Tasks', color: '#10b981' },
  { name: 'Goals', color: '#f59e0b' },
  { name: 'Notes', color: '#8b5cf6' },
  { name: 'Projects', color: '#ef4444' },
  { name: 'Research', color: '#06b6d4' }
];

export default function MindMap() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('mindmap');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    text: '',
    category: 'Ideas'
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load nodes from localStorage on component mount
  useEffect(() => {
    const savedNodes = localStorage.getItem('mindmap_data');
    if (savedNodes) {
      const parsedNodes = JSON.parse(savedNodes);
      setNodes(parsedNodes);
    }
  }, []);

  // Save nodes to localStorage whenever nodes change
  useEffect(() => {
    localStorage.setItem('mindmap_data', JSON.stringify(nodes));
  }, [nodes]);

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
      const sidebar = document.querySelector('.mindmap-sidebar');
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

  const getRandomPosition = () => {
    if (!canvasRef.current) return { x: 200, y: 200 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Random position around center with some spread
    const angle = Math.random() * 2 * Math.PI;
    const distance = 100 + Math.random() * 150;
    
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      showToastMessage('Please enter some text for your idea');
      return;
    }

    const category = CATEGORIES.find(cat => cat.name === formData.category);
    const newPosition = getRandomPosition();

    const newNode: MindMapNode = {
      id: generateId(),
      text: formData.text.trim(),
      category: formData.category,
      color: category?.color || '#3b82f6',
      position: newPosition,
      createdAt: new Date().toISOString()
    };

    setNodes([...nodes, newNode]);
    setFormData({ text: '', category: 'Ideas' });
    showToastMessage('New idea added successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const deleteNode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      setNodes(nodes.filter(node => node.id !== id));
      showToastMessage('Idea deleted successfully!');
    }
  };

  const clearAllNodes = () => {
    if (window.confirm('Are you sure you want to clear all ideas? This cannot be undone.')) {
      setNodes([]);
      showToastMessage('All ideas cleared!');
    }
  };

  const exportNodes = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showToastMessage('Mind map exported successfully!');
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedNode(nodeId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNode 
          ? { ...node, position: { x, y } }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, draggedNode, dragOffset]);

  // Filter nodes based on search and category
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate summary data
  const totalNodes = nodes.length;
  const categories = [...new Set(nodes.map(node => node.category))];
  const recentNodes = nodes.filter(node => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(node.createdAt) > oneDayAgo;
  }).length;

  const summaryCards: SummaryCard[] = [
    {
      title: 'Total Ideas',
      value: totalNodes.toString(),
      subtitle: 'Mind map nodes',
      icon: <FaBrain />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    {
      title: 'Categories',
      value: categories.length.toString(),
      subtitle: 'Active categories',
      icon: <FaPalette />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
    },
    {
      title: 'Recent Ideas',
      value: recentNodes.toString(),
      subtitle: 'Last 24 hours',
      icon: <FaPlus />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    },
    {
      title: 'Filtered',
      value: filteredNodes.length.toString(),
      subtitle: 'Current view',
      icon: <FaFilter />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
    }
  ];

  const sidebarItems = [
    { id: 'mindmap', label: 'Mind Map', icon: <FaBrain /> },
    { id: 'analytics', label: 'Analytics', icon: <FaFilter /> },
    { id: 'export', label: 'Export', icon: <FaDownload /> }
  ];

  // Draw connecting lines between nodes
  const drawConnections = () => {
    if (filteredNodes.length < 2) return null;

    const connections = [];
    const centerNode = filteredNodes[0]; // Use first node as center

    for (let i = 1; i < filteredNodes.length; i++) {
      const node = filteredNodes[i];
      connections.push(
        <line
          key={`connection-${centerNode.id}-${node.id}`}
          x1={centerNode.position.x + 50}
          y1={centerNode.position.y + 50}
          x2={node.position.x + 50}
          y2={node.position.y + 50}
          stroke={node.color}
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.6"
        />
      );
    }

    return connections;
  };

  const renderMindMap = () => (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <h2>Mind Map Creator</h2>
        <p>Organize your thoughts and ideas visually</p>
      </div>

      <div className="mindmap-content">
        <div className="add-node-section">
          <div className="section-card">
            <h3>Add New Idea</h3>
            <form onSubmit={handleSubmit} className="node-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="text">Idea Text</label>
                  <input
                    type="text"
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your idea or thought..."
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <FaPlus />
                Add Idea
              </button>
            </form>
          </div>
        </div>

        <div className="filters-section">
          <div className="section-card">
            <div className="filters-header">
              <h3>Search & Filter</h3>
              <div className="filter-controls">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="category-filter">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mindmap-workspace">
          <div className="workspace-header">
            <h3>Mind Map Canvas</h3>
            <div className="workspace-actions">
              <button className="btn-secondary" onClick={exportNodes}>
                <FaDownload />
                Export
              </button>
              <button className="btn-secondary danger" onClick={clearAllNodes}>
                <FaTrash />
                Clear All
              </button>
            </div>
          </div>
          
          <div 
            ref={canvasRef}
            className="mindmap-canvas"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <svg className="connections-svg">
              {drawConnections()}
            </svg>
            
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node, index) => (
                <div
                  key={node.id + index}
                  className={`mindmap-node ${isDragging && draggedNode === node.id ? 'dragging' : ''}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    backgroundColor: node.color,
                    borderColor: node.color
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <div className="node-content">
                    <div className="node-category-badge" style={{ backgroundColor: node.color }}>
                      {node.category}
                    </div>
                    <p className="node-text">{node.text}</p>
                    <div className="node-actions">
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        title="Delete idea"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-canvas">
                <FaBrain />
                <h3>No Ideas Yet</h3>
                <p>Add your first idea to start building your mind map!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Mind Map Analytics</h2>
        <p>Track your idea organization and productivity</p>
      </div>

      <div className="analytics-content">
        <div className="category-breakdown-section">
          <div className="section-card">
            <h3>Category Breakdown</h3>
            <div className="category-stats">
              {CATEGORIES.map(category => {
                const count = nodes.filter(node => node.category === category.name).length;
                const percentage = totalNodes > 0 ? Math.round((count / totalNodes) * 100) : 0;
                
                return (
                  <div key={category.name} className="category-stat">
                    <div className="category-info">
                      <div 
                        className="category-color" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="category-name">{category.name}</span>
                    </div>
                    <div className="category-numbers">
                      <span className="category-count">{count}</span>
                      <span className="category-percentage">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="productivity-section">
          <div className="section-card">
            <h3>Productivity Insights</h3>
            <div className="insights-grid">
              <div className="insight-item">
                <div className="insight-value">{totalNodes}</div>
                <div className="insight-label">Total Ideas</div>
              </div>
              <div className="insight-item">
                <div className="insight-value">{recentNodes}</div>
                <div className="insight-label">Ideas Today</div>
              </div>
              <div className="insight-item">
                <div className="insight-value">{categories.length}</div>
                <div className="insight-label">Categories Used</div>
              </div>
              <div className="insight-item">
                <div className="insight-value">
                  {totalNodes > 0 ? Math.round(totalNodes / categories.length) : 0}
                </div>
                <div className="insight-label">Avg per Category</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="export-container">
      <div className="export-header">
        <h2>Export & Backup</h2>
        <p>Save and share your mind map data</p>
      </div>

      <div className="export-content">
        <div className="export-section">
          <div className="section-card">
            <h3>Export Options</h3>
            <div className="export-options">
              <div className="export-option">
                <div className="option-info">
                  <h4>JSON Export</h4>
                  <p>Export all your mind map data as a JSON file for backup or sharing</p>
                </div>
                <button className="btn-primary" onClick={exportNodes}>
                  <FaDownload />
                  Export JSON
                </button>
              </div>
              
              <div className="export-option">
                <div className="option-info">
                  <h4>Data Summary</h4>
                  <p>Current mind map statistics and overview</p>
                </div>
                <div className="summary-stats">
                  <div className="stat">
                    <span className="stat-label">Total Nodes:</span>
                    <span className="stat-value">{totalNodes}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Categories:</span>
                    <span className="stat-value">{categories.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Last Updated:</span>
                    <span className="stat-value">
                      {nodes.length > 0 
                        ? new Date(Math.max(...nodes.map(n => new Date(n.createdAt).getTime()))).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'mindmap':
        return renderMindMap();
      case 'analytics':
        return renderAnalytics();
      case 'export':
        return renderExport();
      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <h2>{sidebarItems.find(item => item.id === activePage)?.label}</h2>
              <p>This feature is coming soon! We're working hard to bring you more mind mapping capabilities.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`mindmap-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`mindmap-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaBrain />
            <span>Mind Map</span>
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
        <div className="mindmap-topbar">
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
              <span>Mind Map Creator</span>
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

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
} 