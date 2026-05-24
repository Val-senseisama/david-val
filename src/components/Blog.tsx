import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaLinkedin, 
  FaBook, 
  FaExternalLinkAlt, 
  FaSearch, 
  FaTimes, 
  FaSpinner, 
  FaArrowLeft,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import blogsData from "../data/blogs.json";

interface BlogItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  platform: string;
  url: string;
  embedUrl: string;
  tags: string[];
}

export default function Blog() {
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogItem[]>(blogsData);
  const [preloadedMap, setPreloadedMap] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const markPreloaded = (id: string) => {
    setPreloadedMap(prev => new Set([...prev, id]));
  };

  // Apply filters
  useEffect(() => {
    let result = blogsData;
    
    if (filterPlatform !== "all") {
      result = result.filter(blog => blog.platform === filterPlatform);
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        blog.description.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredBlogs(result);
  }, [filterPlatform, searchQuery]);

  // Open modal — skip spinner if already preloaded
  const handleOpenBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setIframeLoading(!preloadedMap.has(blog.id));
    document.body.style.overflow = "hidden";
  };

  // Close modal
  const handleCloseBlog = () => {
    setSelectedBlog(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="blog" style={{
      minHeight: "100vh",
      background: "#050505",
      color: "white",
      position: "relative",
      overflow: "hidden",
      padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)",
      borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
    }}>

      {/*
        Hidden off-screen iframe preloader.
        Rendered on mount so the browser fetches & caches all embed
        resources (HTML / CSS / JS / fonts) in the background.
        When the modal opens, the in-modal iframe hits the cache → near-instant load.
        Uses position:fixed + left:-9999px so layout is never affected.
      */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}
      >
        {blogsData.map(blog => (
          <iframe
            key={blog.id}
            src={blog.embedUrl}
            title={`preload-${blog.id}`}
            width="1"
            height="1"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
            onLoad={() => markPreloaded(blog.id)}
          />
        ))}
      </div>

      {/* Decorative Golden Ambient Glows */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)",
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <p style={{ 
            fontSize: "0.75rem", 
            letterSpacing: "0.2em", 
            textTransform: "uppercase", 
            color: "#D4AF37", 
            marginBottom: "0.75rem", 
            fontWeight: 600 
          }}>
            Insights & Documentation
          </p>
          <h2 style={{ 
            fontSize: "clamp(1.8rem, 5vw, 3rem)", 
            fontWeight: 800, 
            color: "#fff", 
            marginBottom: "1rem",
            fontFamily: "'Cinzel', serif"
          }}>
            Technical Blog Hub
          </h2>
          <p style={{ 
            color: "#888", 
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)", 
            maxWidth: "600px", 
            margin: "0 auto", 
            lineHeight: 1.7 
          }}>
            A curated collection of system designs, engineering notes, and technical articles embedded directly from my Notion and LinkedIn workspaces.
          </p>
        </motion.div>

        {/* Filter and Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? "1.5rem" : "3rem",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(212, 175, 55, 0.1)",
            borderRadius: "16px",
            padding: isMobile ? "1rem" : "1.25rem 2rem",
            backdropFilter: "blur(10px)",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {/* Platform Tabs */}
          <div style={{ 
            display: "flex", 
            gap: "0.5rem", 
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "center",
            maxWidth: "500px"
          }}>
            {["all", "notion", "linkedin"].map((platform) => (
              <button
                key={platform}
                onClick={() => setFilterPlatform(platform)}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: `1px solid ${filterPlatform === platform ? "rgba(212, 175, 55, 0.4)" : "rgba(212, 175, 55, 0.08)"}`,
                  background: filterPlatform === platform ? "rgba(212, 175, 55, 0.12)" : "rgba(255, 255, 255, 0.01)",
                  color: filterPlatform === platform ? "#D4AF37" : "#aaa",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {platform === "notion" && <SiNotion size={13} />}
                {platform === "linkedin" && <FaLinkedin size={13} />}
                {platform === "all" && <FaBook size={13} />}
                {platform === "all" ? "All Platforms" : platform}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: isMobile ? "100%" : "350px",
            display: "flex",
            alignItems: "center"
          }}>
            <FaSearch style={{
              position: "absolute",
              left: "1rem",
              color: "#666",
              fontSize: "0.9rem"
            }} />
            <input
              type="text"
              placeholder="Search articles, tags, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(212, 175, 55, 0.15)",
                background: "rgba(5, 5, 5, 0.6)",
                color: "white",
                fontSize: "0.88rem",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = "#D4AF37"}
              onBlur={(e) => e.target.style.borderColor = "rgba(212, 175, 55, 0.15)"}
            />
            {searchQuery && (
              <FaTimes 
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "1rem",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }} 
              />
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(212, 175, 55, 0.1)",
              borderRadius: "16px",
              color: "#666"
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#888" }}>No articles found</p>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting your search query or switching platforms.</p>
          </motion.div>
        )}

        {/* Blog Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          gap: isMobile ? "1.25rem" : "2rem",
        }}>
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => handleOpenBlog(blog)}
              style={{
                background: "rgba(10, 10, 10, 0.6)",
                border: "1px solid rgba(212, 175, 55, 0.12)",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxSizing: "border-box",
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
              whileHover={{
                y: -6,
                borderColor: "rgba(212, 175, 55, 0.4)",
                backgroundColor: "rgba(212, 175, 55, 0.04)",
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.06)",
              }}
            >
              {/* Premium Gradient / Cover Visual */}
              <div style={{
                height: "140px",
                position: "relative",
                overflow: "hidden",
                background: blog.platform === "notion" 
                  ? "linear-gradient(135deg, #1f1f1f 0%, #121212 100%)"
                  : "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* CSS animated gold mesh backdrop */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: "radial-gradient(circle at 20% 30%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 60%, #D4AF37 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />
                
                {/* Big Center Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: "rgba(5, 5, 5, 0.8)",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: blog.platform === "notion" ? "#D4AF37" : "#0A66C2",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    zIndex: 2
                  }}
                >
                  {blog.platform === "notion" ? <SiNotion size={30} /> : <FaLinkedin size={30} />}
                </motion.div>

                {/* Platform Badge */}
                <span style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  background: blog.platform === "notion" ? "rgba(0,0,0,0.6)" : "#0A66C2",
                  border: "1px solid rgba(212,175,55,0.15)",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "20px",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}>
                  {blog.platform === "notion" ? <SiNotion size={10} /> : <FaLinkedin size={10} />}
                  {blog.platform}
                </span>
              </div>

              {/* Card Body */}
              <div style={{
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                boxSizing: "border-box"
              }}>
                {/* Meta details */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  color: "#666",
                  fontSize: "0.75rem",
                  marginBottom: "0.75rem"
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FaCalendarAlt size={10} color="#D4AF37" />
                    {blog.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FaClock size={10} color="#D4AF37" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.4,
                  margin: "0 0 0.8rem 0",
                  transition: "color 0.3s ease"
                }}>
                  {blog.title}
                </h3>

                <p style={{
                  color: "#888",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  margin: "0 0 1.5rem 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexGrow: 1
                }}>
                  {blog.description}
                </p>

                {/* Tags */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "1.2rem"
                }}>
                  {blog.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: "0.7rem",
                      color: "#D4AF37",
                      background: "rgba(212, 175, 55, 0.06)",
                      border: "1px solid rgba(212, 175, 55, 0.15)",
                      borderRadius: "6px",
                      padding: "0.15rem 0.5rem",
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Link */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#D4AF37",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginTop: "auto",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  <span>Open Embedded Blog</span>
                  <FaExternalLinkAlt size={10} style={{ transition: "transform 0.3s ease" }} />
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* High-Fidelity Reader Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(3, 3, 3, 0.85)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: isMobile ? "flex-end" : "center",
              justifyContent: "center",
              padding: isMobile ? "0" : "clamp(0.5rem, 3vw, 2rem)",
            }}
          >
            <motion.div
              initial={isMobile ? { y: "100%", opacity: 1 } : { scale: 0.95, y: 30, opacity: 0 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, y: 0, opacity: 1 }}
              exit={isMobile ? { y: "100%", opacity: 1 } : { scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : "1100px",
                height: isMobile ? "92vh" : "90vh",
                background: "#0c0c0c",
                border: isMobile ? "none" : "1px solid rgba(212, 175, 55, 0.25)",
                borderRadius: isMobile ? "20px 20px 0 0" : "24px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.05)",
                position: "relative"
              }}
            >
              {/* Modal Top Control Bar */}
              <div style={{
                padding: isMobile ? "0.75rem 1rem" : "1rem 1.5rem",
                borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
                background: "rgba(12, 12, 12, 0.9)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                gap: "0.5rem",
              }}>
                {/* Back / Close button */}
                <button
                  onClick={handleCloseBlog}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    color: "#aaa",
                    cursor: "pointer",
                    padding: isMobile ? "0.5rem" : "0.5rem 1rem",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    flexShrink: 0,
                    transition: "all 0.3s ease"
                  }}
                >
                  <FaArrowLeft size={12} />
                  {!isMobile && <span>Back</span>}
                </button>

                {/* Title — hidden on mobile to save space */}
                {!isMobile && (
                  <h4 style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    flex: 1,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "0 1rem",
                  }}>
                    {selectedBlog.title}
                  </h4>
                )}

                {isMobile && (
                  <span style={{
                    flex: 1,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#888",
                    textAlign: "center",
                    textTransform: "capitalize",
                    letterSpacing: "0.05em",
                  }}>
                    {selectedBlog.platform}
                  </span>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                  <a
                    href={selectedBlog.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "rgba(212, 175, 55, 0.12)",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      color: "#D4AF37",
                      cursor: "pointer",
                      padding: isMobile ? "0.5rem" : "0.5rem 1rem",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {!isMobile && <span>View Original</span>}
                    <FaExternalLinkAlt size={isMobile ? 14 : 11} />
                  </a>

                  <button
                    onClick={handleCloseBlog}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#666",
                      cursor: "pointer",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Embedding IFrame Viewer Area */}
              <div style={{
                position: "relative",
                flexGrow: 1,
                width: "100%",
                height: "100%",
                background: "#080808",
                overflowY: selectedBlog.platform === "linkedin" ? "auto" : "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: selectedBlog.platform === "linkedin" ? "center" : "stretch",
                justifyContent: selectedBlog.platform === "linkedin" ? "flex-start" : "stretch",
                padding: selectedBlog.platform === "linkedin" ? "2rem 0" : "0",
                boxSizing: "border-box",
              }}>
                {/* Premium Loading Spinner Backdrop */}
                {iframeLoading && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "#080808",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.2rem",
                    zIndex: 3
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{ color: "#D4AF37" }}
                    >
                      <FaSpinner size={36} />
                    </motion.div>
                    <p style={{
                      color: "#888",
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      margin: 0
                    }}>
                      Loading Embedded Content...
                    </p>
                  </div>
                )}

                {/* IFrame Element */}
                <iframe
                  src={selectedBlog.embedUrl}
                  title={selectedBlog.title}
                  width="100%"
                  height={selectedBlog.platform === "linkedin" ? "800" : "100%"}
                  frameBorder="0"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                  onLoad={() => setIframeLoading(false)}
                  style={{
                    border: "none",
                    // LinkedIn: cap at 504px on desktop, full width on mobile
                    width: selectedBlog.platform === "linkedin"
                      ? (isMobile ? "100%" : "504px")
                      : "100%",
                    height: selectedBlog.platform === "linkedin" ? "800px" : "100%",
                    maxWidth: "100%",
                    background: "transparent",
                    display: "block",
                    zIndex: 2,
                    position: "relative",
                    borderRadius: selectedBlog.platform === "linkedin" && !isMobile ? "12px" : "0",
                    boxShadow: selectedBlog.platform === "linkedin" && !isMobile
                      ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)"
                      : "none",
                    flexShrink: 0,
                  }}
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
