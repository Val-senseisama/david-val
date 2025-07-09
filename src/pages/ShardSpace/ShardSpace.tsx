import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaBars, FaTimes, FaArrowLeft, FaSun, FaMoon, FaGem, FaTrophy, FaCheck, FaPlay, FaPause, FaDownload, FaArchive, FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './ShardSpace.css';

interface Quest {
  id: string;
  title: string;
  xp: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

interface Milestone {
  id: string;
  title: string;
  xpTarget: number;
  quests: Quest[];
  createdAt: string;
}

interface Shard {
  id: string;
  title: string;
  category: string;
  targetXP: number;
  milestones: Milestone[];
  createdAt: string;
  archived?: boolean;
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
  'Career', 'Health', 'Finance', 'Education', 'Relationships', 'Personal', 'Creative', 'Travel'
];

const BADGES = [
  { name: 'Beginner', xp: 100, icon: '🥉' },
  { name: 'Explorer', xp: 250, icon: '🥈' },
  { name: 'Achiever', xp: 500, icon: '🥇' },
  { name: 'Master', xp: 1000, icon: '👑' }
];

export default function ShardSpace() {
  const navigate = useNavigate();
  const { shardId } = useParams<{ shardId: string }>();
  const [shards, setShards] = useState<Shard[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('shards');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Career',
    targetXP: 500
  });
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    xpTarget: 100
  });
  const [questForm, setQuestForm] = useState({
    title: '',
    xp: 25
  });
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editingQuest, setEditingQuest] = useState<string | null>(null);

  // Load shards from localStorage on component mount
  useEffect(() => {
    const savedShards = localStorage.getItem('shardspace_data');
    if (savedShards) {
      const parsedShards = JSON.parse(savedShards);
      setShards(parsedShards);
    }
  }, []);

  // Save shards to localStorage whenever shards change
  useEffect(() => {
    localStorage.setItem('shardspace_data', JSON.stringify(shards));
  }, [shards]);

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
      const sidebar = document.querySelector('.shardspace-sidebar');
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

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showToastMessage('Please enter a shard title');
      return;
    }

    const newShard: Shard = {
      id: uuidv4(),
      title: formData.title.trim(),
      category: formData.category,
      targetXP: formData.targetXP,
      milestones: [],
      createdAt: new Date().toISOString()
    };

    setShards([...shards, newShard]);
    setFormData({ title: '', category: 'Career', targetXP: 500 });
    showToastMessage('New shard created successfully!');
    navigate(`/shardspace/${newShard.id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetXP' ? parseInt(value) || 0 : value
    }));
  };

  const handleMilestoneSubmit = (e: React.FormEvent, shardId: string) => {
    e.preventDefault();
    
    if (!milestoneForm.title.trim()) {
      showToastMessage('Please enter a milestone title');
      return;
    }

    const newMilestone: Milestone = {
      id: uuidv4(),
      title: milestoneForm.title.trim(),
      xpTarget: milestoneForm.xpTarget,
      quests: [],
      createdAt: new Date().toISOString()
    };

    setShards(prevShards => 
      prevShards.map(shard => 
        shard.id === shardId 
          ? { ...shard, milestones: [...shard.milestones, newMilestone] }
          : shard
      )
    );

    setMilestoneForm({ title: '', xpTarget: 100 });
    showToastMessage('New milestone added!');
  };

  const handleQuestSubmit = (e: React.FormEvent, shardId: string, milestoneId: string) => {
    e.preventDefault();
    
    if (!questForm.title.trim()) {
      showToastMessage('Please enter a quest title');
      return;
    }

    const newQuest: Quest = {
      id: uuidv4(),
      title: questForm.title.trim(),
      xp: questForm.xp,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setShards(prevShards => 
      prevShards.map(shard => 
        shard.id === shardId 
          ? {
              ...shard,
              milestones: shard.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? { ...milestone, quests: [...milestone.quests, newQuest] }
                  : milestone
              )
            }
          : shard
      )
    );

    setQuestForm({ title: '', xp: 25 });
    showToastMessage('New quest added!');
  };

  const updateQuestStatus = (shardId: string, milestoneId: string, questId: string, status: Quest['status']) => {
    setShards(prevShards => 
      prevShards.map(shard => 
        shard.id === shardId 
          ? {
              ...shard,
              milestones: shard.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      quests: milestone.quests.map(quest =>
                        quest.id === questId
                          ? { ...quest, status }
                          : quest
                      )
                    }
                  : milestone
              )
            }
          : shard
      )
    );

    const statusText = status === 'Completed' ? 'completed' : status === 'In Progress' ? 'started' : 'paused';
    showToastMessage(`Quest ${statusText}!`);
  };

  const deleteShard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shard?')) {
      setShards(shards.filter(shard => shard.id !== id));
      showToastMessage('Shard deleted successfully!');
      navigate('/shardspace');
    }
  };

  const deleteMilestone = (shardId: string, milestoneId: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      setShards(prevShards => 
        prevShards.map(shard => 
          shard.id === shardId 
            ? { ...shard, milestones: shard.milestones.filter(m => m.id !== milestoneId) }
            : shard
        )
      );
      showToastMessage('Milestone deleted successfully!');
    }
  };

  const deleteQuest = (shardId: string, milestoneId: string, questId: string) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      setShards(prevShards => 
        prevShards.map(shard => 
          shard.id === shardId 
            ? {
                ...shard,
                milestones: shard.milestones.map(milestone =>
                  milestone.id === milestoneId
                    ? { ...milestone, quests: milestone.quests.filter(q => q.id !== questId) }
                    : milestone
                )
              }
            : shard
        )
      );
      showToastMessage('Quest deleted successfully!');
    }
  };

  const archiveShard = (id: string) => {
    setShards(prevShards => 
      prevShards.map(shard => 
        shard.id === id ? { ...shard, archived: true } : shard
      )
    );
    showToastMessage('Shard archived!');
  };

  const exportShard = (shard: Shard) => {
    const dataStr = JSON.stringify(shard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shard-${shard.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToastMessage('Shard exported successfully!');
  };

  // Calculate XP and progress
  const calculateShardProgress = (shard: Shard) => {
    const totalEarned = shard.milestones.reduce((total, milestone) => {
      return total + milestone.quests.reduce((milestoneTotal, quest) => {
        return quest.status === 'Completed' ? milestoneTotal + quest.xp : milestoneTotal;
      }, 0);
    }, 0);
    
    return {
      earned: totalEarned,
      target: shard.targetXP,
      percentage: Math.min((totalEarned / shard.targetXP) * 100, 100)
    };
  };

  const calculateMilestoneProgress = (milestone: Milestone) => {
    const earned = milestone.quests.reduce((total, quest) => {
      return quest.status === 'Completed' ? total + quest.xp : total;
    }, 0);
    
    return {
      earned,
      target: milestone.xpTarget,
      percentage: Math.min((earned / milestone.xpTarget) * 100, 100)
    };
  };

  const getEarnedBadges = (totalXP: number) => {
    return BADGES.filter(badge => totalXP >= badge.xp);
  };

  // Get current shard
  const currentShard = shards.find(shard => shard.id === shardId);
  const activeShards = shards.filter(shard => !shard.archived);
  const archivedShards = shards.filter(shard => shard.archived);

  // Calculate summary data
  const totalShards = activeShards.length;
  const totalXP = activeShards.reduce((total, shard) => {
    return total + calculateShardProgress(shard).earned;
  }, 0);
  const totalQuests = activeShards.reduce((total, shard) => {
    return total + shard.milestones.reduce((milestoneTotal, milestone) => {
      return milestoneTotal + milestone.quests.length;
    }, 0);
  }, 0);
  const completedQuests = activeShards.reduce((total, shard) => {
    return total + shard.milestones.reduce((milestoneTotal, milestone) => {
      return milestoneTotal + milestone.quests.filter(quest => quest.status === 'Completed').length;
    }, 0);
  }, 0);

  const summaryCards: SummaryCard[] = [
    {
      title: 'Active Shards',
      value: totalShards.toString(),
      subtitle: 'Goals in progress',
      icon: <FaGem />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    {
      title: 'Total XP',
      value: totalXP.toString(),
      subtitle: 'Experience earned',
      icon: <FaTrophy />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
    },
    {
      title: 'Quests Completed',
      value: `${completedQuests}/${totalQuests}`,
      subtitle: 'Progress ratio',
      icon: <FaCheck />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    },
    {
      title: 'Badges Earned',
      value: getEarnedBadges(totalXP).length.toString(),
      subtitle: 'Achievements unlocked',
      icon: <FaStar />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
    }
  ];

  const sidebarItems = [
    { id: 'shards', label: 'All Shards', icon: <FaGem /> },
    { id: 'archived', label: 'Archived', icon: <FaArchive /> }
  ];

  const renderShardsList = () => (
    <div className="shards-container">
      <div className="shards-header">
        <h2>Your Shards</h2>
        <p>Break down your biggest goals into manageable milestones and quests</p>
      </div>

      <div className="shards-content">
        <div className="create-shard-section">
          <div className="section-card">
            <h3>Create New Shard</h3>
            <form onSubmit={handleShardSubmit} className="shard-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="title">Shard Name</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your major goal..."
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
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="targetXP">Target XP</label>
                  <input
                    type="number"
                    id="targetXP"
                    name="targetXP"
                    value={formData.targetXP}
                    onChange={handleInputChange}
                    min="100"
                    step="50"
                    className="form-input"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                <FaPlus />
                Create Shard
              </button>
            </form>
          </div>
        </div>

        <div className="shards-grid">
          {activeShards.length > 0 ? (
            activeShards.map((shard) => {
              const progress = calculateShardProgress(shard);
              const earnedBadges = getEarnedBadges(progress.earned);
              
              return (
                <div key={shard.id} className="shard-card">
                  <div className="shard-header">
                    <div className="shard-info">
                      <h3>{shard.title}</h3>
                      <span className="shard-category">{shard.category}</span>
                    </div>
                    <div className="shard-actions">
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/shardspace/${shard.id}`)}
                        title="View Shard"
                      >
                        <FaGem />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => exportShard(shard)}
                        title="Export Shard"
                      >
                        <FaDownload />
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => archiveShard(shard.id)}
                        title="Archive Shard"
                      >
                        <FaArchive />
                      </button>
                    </div>
                  </div>
                  
                  <div className="shard-progress">
                    <div className="progress-info">
                      <span className="xp-text">{progress.earned} / {progress.target} XP</span>
                      <span className="progress-percentage">{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="shard-stats">
                    <div className="stat">
                      <span className="stat-label">Milestones:</span>
                      <span className="stat-value">{shard.milestones.length}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Quests:</span>
                      <span className="stat-value">
                        {shard.milestones.reduce((total, m) => total + m.quests.length, 0)}
                      </span>
                    </div>
                  </div>

                  {earnedBadges.length > 0 && (
                    <div className="shard-badges">
                      {earnedBadges.map((badge, index) => (
                        <span key={index} className="badge" title={`${badge.name} (${badge.xp} XP)`}>
                          {badge.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-shards">
              <FaGem />
              <h3>No Shards Yet</h3>
              <p>Create your first shard to start breaking down your goals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderShardDetail = () => {
    if (!currentShard) {
      return (
        <div className="shard-not-found">
          <h2>Shard Not Found</h2>
          <p>The shard you're looking for doesn't exist.</p>
          <button className="btn-primary" onClick={() => navigate('/shardspace')}>
            Back to Shards
          </button>
        </div>
      );
    }

    const progress = calculateShardProgress(currentShard);
    const earnedBadges = getEarnedBadges(progress.earned);

    return (
      <div className="shard-detail-container">
        <div className="shard-detail-header">
          <div className="shard-title-section">
            <h2>{currentShard.title}</h2>
            <span className="shard-category">{currentShard.category}</span>
          </div>
          <div className="shard-actions">
            <button 
              className="btn-secondary"
              onClick={() => exportShard(currentShard)}
            >
              <FaDownload />
              Export
            </button>
            <button 
              className="btn-secondary danger"
              onClick={() => deleteShard(currentShard.id)}
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>

        <div className="shard-progress-section">
          <div className="progress-card">
            <div className="progress-header">
              <h3>Overall Progress</h3>
              <div className="xp-display">
                <span className="xp-earned">{progress.earned}</span>
                <span className="xp-separator">/</span>
                <span className="xp-target">{progress.target}</span>
                <span className="xp-label">XP</span>
              </div>
            </div>
            <div className="progress-bar large">
              <div 
                className="progress-fill"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="progress-percentage-large">
              {Math.round(progress.percentage)}% Complete
            </div>
          </div>

          {earnedBadges.length > 0 && (
            <div className="badges-section">
              <h3>Badges Earned</h3>
              <div className="badges-grid">
                {earnedBadges.map((badge, index) => (
                  <div key={index} className="badge-card">
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-xp">{badge.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="milestones-section">
          <div className="section-header">
            <h3>Milestones</h3>
            <button 
              className="btn-primary"
              onClick={() => setEditingMilestone('new')}
            >
              <FaPlus />
              Add Milestone
            </button>
          </div>

          {editingMilestone === 'new' && (
            <div className="form-card">
              <h4>Add New Milestone</h4>
              <form onSubmit={(e) => handleMilestoneSubmit(e, currentShard.id)}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="milestone-title">Title</label>
                    <input
                      type="text"
                      id="milestone-title"
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                      className="form-input"
                      placeholder="Milestone title..."
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="milestone-xp">XP Target</label>
                    <input
                      type="number"
                      id="milestone-xp"
                      value={milestoneForm.xpTarget}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, xpTarget: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      min="25"
                      step="25"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <FaPlus />
                    Add Milestone
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setEditingMilestone(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="milestones-grid">
            {currentShard.milestones.length > 0 ? (
              currentShard.milestones.map((milestone) => {
                const milestoneProgress = calculateMilestoneProgress(milestone);
                
                return (
                  <div key={milestone.id} className="milestone-card">
                    <div className="milestone-header">
                      <h4>{milestone.title}</h4>
                      <div className="milestone-actions">
                        <button 
                          className="action-btn"
                          onClick={() => setEditingQuest(milestone.id)}
                          title="Add Quest"
                        >
                          <FaPlus />
                        </button>
                        <button 
                          className="action-btn danger"
                          onClick={() => deleteMilestone(currentShard.id, milestone.id)}
                          title="Delete Milestone"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="milestone-progress">
                      <div className="progress-info">
                        <span className="xp-text">{milestoneProgress.earned} / {milestoneProgress.target} XP</span>
                        <span className="progress-percentage">{Math.round(milestoneProgress.percentage)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${milestoneProgress.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {editingQuest === milestone.id && (
                      <div className="quest-form-card">
                        <h5>Add New Quest</h5>
                        <form onSubmit={(e) => handleQuestSubmit(e, currentShard.id, milestone.id)}>
                          <div className="form-grid">
                            <div className="form-field">
                              <label htmlFor="quest-title">Title</label>
                              <input
                                type="text"
                                id="quest-title"
                                value={questForm.title}
                                onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
                                className="form-input"
                                placeholder="Quest title..."
                                required
                              />
                            </div>
                            <div className="form-field">
                              <label htmlFor="quest-xp">XP Reward</label>
                              <input
                                type="number"
                                id="quest-xp"
                                value={questForm.xp}
                                onChange={(e) => setQuestForm({ ...questForm, xp: parseInt(e.target.value) || 0 })}
                                className="form-input"
                                min="5"
                                step="5"
                              />
                            </div>
                          </div>
                          <div className="form-actions">
                            <button type="submit" className="btn-primary">
                              <FaPlus />
                              Add Quest
                            </button>
                            <button 
                              type="button" 
                              className="btn-secondary"
                              onClick={() => setEditingQuest(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="quests-list">
                      {milestone.quests.length > 0 ? (
                        milestone.quests.map((quest) => (
                          <div key={quest.id} className={`quest-card ${quest.status.toLowerCase()}`}>
                            <div className="quest-info">
                              <h5>{quest.title}</h5>
                              <span className="quest-xp">{quest.xp} XP</span>
                            </div>
                            <div className="quest-status">
                              <span className={`status-badge ${quest.status.toLowerCase()}`}>
                                {quest.status}
                              </span>
                            </div>
                            <div className="quest-actions">
                              {quest.status === 'Pending' && (
                                <button 
                                  className="action-btn"
                                  onClick={() => updateQuestStatus(currentShard.id, milestone.id, quest.id, 'In Progress')}
                                  title="Start Quest"
                                >
                                  <FaPlay />
                                </button>
                              )}
                              {quest.status === 'In Progress' && (
                                <>
                                  <button 
                                    className="action-btn"
                                    onClick={() => updateQuestStatus(currentShard.id, milestone.id, quest.id, 'Completed')}
                                    title="Complete Quest"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button 
                                    className="action-btn"
                                    onClick={() => updateQuestStatus(currentShard.id, milestone.id, quest.id, 'Pending')}
                                    title="Pause Quest"
                                  >
                                    <FaPause />
                                  </button>
                                </>
                              )}
                              {quest.status === 'Completed' && (
                                <button 
                                  className="action-btn"
                                  onClick={() => updateQuestStatus(currentShard.id, milestone.id, quest.id, 'In Progress')}
                                  title="Reopen Quest"
                                >
                                  <FaPlay />
                                </button>
                              )}
                              <button 
                                className="action-btn danger"
                                onClick={() => deleteQuest(currentShard.id, milestone.id, quest.id)}
                                title="Delete Quest"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-quests">
                          <p>No quests yet. Add your first quest to start earning XP!</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-milestones">
                <FaGem />
                <h3>No Milestones Yet</h3>
                <p>Add your first milestone to break down your shard into manageable steps!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderArchived = () => (
    <div className="archived-container">
      <div className="archived-header">
        <h2>Archived Shards</h2>
        <p>Completed or paused goals</p>
      </div>

      <div className="archived-grid">
        {archivedShards.length > 0 ? (
          archivedShards.map((shard) => {
            const progress = calculateShardProgress(shard);
            
            return (
              <div key={shard.id} className="archived-card">
                <div className="archived-header">
                  <h3>{shard.title}</h3>
                  <span className="archived-category">{shard.category}</span>
                </div>
                
                <div className="archived-progress">
                  <div className="progress-info">
                    <span className="xp-text">{progress.earned} / {progress.target} XP</span>
                    <span className="progress-percentage">{Math.round(progress.percentage)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="archived-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => exportShard(shard)}
                  >
                    <FaDownload />
                    Export
                  </button>
                  <button 
                    className="btn-secondary danger"
                    onClick={() => deleteShard(shard.id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-archived">
            <FaArchive />
            <h3>No Archived Shards</h3>
            <p>Archived shards will appear here when you pause or complete goals.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPageContent = () => {
    if (shardId) {
      return renderShardDetail();
    }
    
    switch (activePage) {
      case 'shards':
        return renderShardsList();
      case 'archived':
        return renderArchived();
      default:
        return renderShardsList();
    }
  };

  return (
    <div className={`shardspace-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className={`shardspace-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaGem />
            <span>ShardSpace</span>
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
        <div className="shardspace-topbar">
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
            <h1>{shardId ? currentShard?.title : 'ShardSpace'}</h1>
          </div>
          <div className="topbar-right">
            <div className="user-info">
              <span>Goal Visualization</span>
            </div>
          </div>
        </div>

        {/* Summary Cards - Only show on main page */}
        {!shardId && (
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
        )}

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