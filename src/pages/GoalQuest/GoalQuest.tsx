import React, { useState, useEffect } from 'react';
import { useSEO } from '../../hooks/useSEO';
import { FaPlus, FaTrash, FaBars, FaTimes, FaArrowLeft, FaSun, FaMoon, FaTrophy, FaCalendarAlt, FaStar, FaCheck, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './GoalQuest.css';

interface Quest {
  id: string;
  title: string;
  xp: number;
  deadline: string;
  completed: boolean;
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

export default function GoalQuest() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('quests');
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'xp' | 'deadline' | 'created'>('created');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    xp: '',
    deadline: ''
  });

  // SEO for GoalQuest page
  useSEO({
    title: 'GoalQuest - Gamified Goal Tracking | ValTech',
    description: 'Gamified goal tracking application with XP system, quests, and progress visualization. Turn your goals into exciting quests and track your achievements.',
    keywords: 'Goal Tracking, Gamification, Quest System, XP Points, Achievement Tracking, Personal Development',
    ogUrl: 'https://david-val.vercel.app/goal-quest',
    ogImage: 'https://david-val.vercel.app/goal-quest-og.jpg',
    canonical: 'https://david-val.vercel.app/goal-quest'
  });

  // Load quests from localStorage on component mount
  useEffect(() => {
    const savedQuests = localStorage.getItem('goal_quest_data');
    if (savedQuests) {
      const parsedQuests = JSON.parse(savedQuests);
      setQuests(parsedQuests);
    }
  }, []);

  // Save quests to localStorage whenever quests change
  useEffect(() => {
    localStorage.setItem('goal_quest_data', JSON.stringify(quests));
  }, [quests]);

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
      const sidebar = document.querySelector('.quest-sidebar');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.xp || !formData.deadline) {
      showToastMessage('Please fill in all fields');
      return;
    }

    const newQuest: Quest = {
      id: generateId(),
      title: formData.title,
      xp: parseInt(formData.xp),
      deadline: formData.deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setQuests([...quests, newQuest]);
    setFormData({ title: '', xp: '', deadline: '' });
    showToastMessage('New quest added successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleQuestStatus = (id: string) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === id) {
        const wasCompleted = quest.completed;
        const newQuest = { ...quest, completed: !quest.completed };
        
        if (!wasCompleted) {
          // Quest was just completed - show celebration
          showToastMessage(`🎉 Quest completed! +${quest.xp} XP earned!`);
        }
        
        return newQuest;
      }
      return quest;
    });
    
    setQuests(updatedQuests);
  };

  const deleteQuest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      setQuests(quests.filter(quest => quest.id !== id));
      showToastMessage('Quest deleted successfully!');
    }
  };

  const clearCompletedQuests = () => {
    if (window.confirm('Are you sure you want to clear all completed quests?')) {
      setQuests(quests.filter(quest => !quest.completed));
      showToastMessage('Completed quests cleared!');
    }
  };

  // Calculate summary data
  const totalXP = quests.filter(q => q.completed).reduce((sum, quest) => sum + quest.xp, 0);
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.completed).length;
  const inProgressQuests = totalQuests - completedQuests;
  
  // Calculate XP this week (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const xpThisWeek = quests
    .filter(q => q.completed && new Date(q.createdAt) > oneWeekAgo)
    .reduce((sum, quest) => sum + quest.xp, 0);

  const summaryCards: SummaryCard[] = [
    {
      title: 'Total XP Earned',
      value: totalXP.toString(),
      subtitle: 'Experience points',
      icon: <FaTrophy />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
    },
    {
      title: 'XP This Week',
      value: xpThisWeek.toString(),
      subtitle: 'Weekly progress',
      icon: <FaStar />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    },
    {
      title: 'Active Quests',
      value: inProgressQuests.toString(),
      subtitle: 'In progress',
      icon: <FaPlay />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    {
      title: 'Completed',
      value: completedQuests.toString(),
      subtitle: 'Quests finished',
      icon: <FaCheck />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
    }
  ];

  const sidebarItems = [
    { id: 'quests', label: 'Quests', icon: <FaTrophy /> },
    { id: 'analytics', label: 'Analytics', icon: <FaStar /> },
    { id: 'achievements', label: 'Achievements', icon: <FaTrophy /> }
  ];

  // Filter and sort quests
  const filteredQuests = quests
    .filter(quest => {
      if (filter === 'completed') return quest.completed;
      if (filter === 'in-progress') return !quest.completed;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'xp':
          return b.xp - a.xp;
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const renderQuests = () => (
    <div className="quests-container">
      <div className="quests-header">
        <h2>Your Quests</h2>
        <p>Complete quests to earn XP and level up!</p>
      </div>

      <div className="quests-content">
        <div className="add-quest-section">
          <div className="section-card">
            <h3>Add New Quest</h3>
            <form onSubmit={handleSubmit} className="quest-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="title">Quest Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter quest title"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="xp">XP Reward</label>
                  <input
                    type="number"
                    id="xp"
                    name="xp"
                    value={formData.xp}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    required
                    className="form-input"
                    placeholder="Enter XP reward"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <FaPlus />
                Add Quest
              </button>
            </form>
          </div>
        </div>

        <div className="filters-section">
          <div className="section-card">
            <div className="filters-header">
              <h3>Quest Filters</h3>
              <div className="filter-controls">
                <div className="filter-group">
                  <label>Filter:</label>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="all">All Quests</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Sort by:</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="created">Date Created</option>
                    <option value="xp">XP Reward</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="quests-grid">
          {filteredQuests.length > 0 ? (
            filteredQuests.map(quest => (
              <div key={quest.id} className={`quest-card ${quest.completed ? 'completed' : ''}`}>
                <div className="quest-header">
                  <div className="quest-title">
                    <h4>{quest.title}</h4>
                    <div className="quest-xp">
                      <FaStar />
                      <span>{quest.xp} XP</span>
                    </div>
                  </div>
                  <div className="quest-status">
                    {quest.completed ? (
                      <span className="status completed">Completed</span>
                    ) : (
                      <span className="status in-progress">In Progress</span>
                    )}
                  </div>
                </div>

                <div className="quest-details">
                  <div className="quest-deadline">
                    <FaCalendarAlt />
                    <span>Deadline: {new Date(quest.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="quest-actions">
                  <button 
                    className={`action-btn ${quest.completed ? 'completed' : 'complete'}`}
                    onClick={() => toggleQuestStatus(quest.id)}
                  >
                    {quest.completed ? <FaCheck /> : <FaPlay />}
                    {quest.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => deleteQuest(quest.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-quests">
              <FaTrophy />
              <h3>No Quests Found</h3>
              <p>Add your first quest to start earning XP!</p>
            </div>
          )}
        </div>

        {completedQuests > 0 && (
          <div className="clear-section">
            <button className="btn-secondary" onClick={clearCompletedQuests}>
              Clear Completed Quests
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Quest Analytics</h2>
        <p>Track your progress and achievements</p>
      </div>

      <div className="analytics-content">
        <div className="xp-progress-section">
          <div className="section-card">
            <h3>XP Progress</h3>
            <div className="xp-display">
              <div className="xp-text">
                <span className="xp-number">{totalXP}</span>
                <span className="xp-label">Total XP Earned</span>
              </div>
              <div className="xp-progress-bar">
                <div 
                  className="xp-progress-fill" 
                  style={{ width: `${Math.min((totalXP / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="section-card">
            <h3>Quest Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{totalQuests}</div>
                <div className="stat-label">Total Quests</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{completedQuests}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{inProgressQuests}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0}%
                </div>
                <div className="stat-label">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'quests':
        return renderQuests();
      case 'analytics':
        return renderAnalytics();
      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <h2>{sidebarItems.find(item => item.id === activePage)?.label}</h2>
              <p>This feature is coming soon! We're working hard to bring you more gamification features.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`goalquest-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`quest-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaTrophy />
            <span>Quest Tracker</span>
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
        <div className="quest-topbar">
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
              <span>Goal Quest Tracker</span>
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