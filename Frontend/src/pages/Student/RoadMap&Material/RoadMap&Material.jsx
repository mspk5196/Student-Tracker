import React, { useEffect, useState } from "react";
import {
  FileText,
  Youtube,
  Download,
  ExternalLink,
  CheckCircle2,
  Circle,
  BookOpen,
  Clock,
  ChevronRight,
  Search,
  Book,
  ChevronLeft,
  Loader,
} from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const StudentRoadmap = () => {
  const { token, user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [roadmapData, setRoadmapData] = useState([]);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedModules, setCompletedModules] = useState([]);
  const [modulesTab, setModulesTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const modulesPerPage = 10;

  // Fetch roadmap data from backend
  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/roadmap/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setRoadmapData(data.data || []);
        setVenue(data.venue);
      } else {
        setError(data.message || "Failed to fetch roadmap");
      }
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      setError("Failed to load roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isModuleCompleted = (module) => {
    return (
      completedModules.includes(module.roadmap_id) ||
      module.is_completed === 1 ||
      module.is_completed === true
    );
  };

  // Search + tab filter
  const searchedModules = roadmapData.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredModules = searchedModules.filter((module) => {
    const completed = isModuleCompleted(module);
    return modulesTab === "completed" ? completed : !completed;
  });

  const sidebarModules = roadmapData.filter((module) => {
    const completed = isModuleCompleted(module);
    return modulesTab === "completed" ? completed : !completed;
  });

  // Pagination
  const totalPages = Math.ceil(filteredModules.length / modulesPerPage) || 1;
  const startIdx = (currentPage - 1) * modulesPerPage;
  const endIdx = startIdx + modulesPerPage;
  const paginatedModules = filteredModules.slice(startIdx, endIdx);

  // Reset page if current page exceeds new total after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
  }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 3;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * modulesPerPage + 1;
    const end = Math.min(currentPage * modulesPerPage, totalItems);

    return (
      <div className="pagination-wrapper">
        <span className="pagination-info">
          Showing {start}-{end} of {totalItems} modules
        </span>
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const handleResourceAction = async (resource) => {
    if (resource.resource_type === "pdf" && resource.resource_id) {
      // Download PDF with authentication
      try {
        const response = await fetch(
          `${API_URL}/roadmap/resources/download/${resource.resource_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to download file");
          return;
        }

        // Create a blob from the response
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${resource.resource_name}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download file. Please try again.");
      }
    } else if (resource.resource_url) {
      // Open link or video
      window.open(resource.resource_url, "_blank");
    } else {
      alert("No link available.");
    }
  };

  const toggleComplete = (id) => {
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
    );
  };

  const calculateProgress = () => {
    if (!roadmapData.length) return 0;
    const completed = roadmapData.filter((m) => isModuleCompleted(m)).length;
    return Math.round((completed / roadmapData.length) * 100);
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText size={16} />;
      case "video":
        return <Youtube size={16} />;
      case "link":
        return <ExternalLink size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getResourceTypeLabel = (type) => {
    switch (type) {
      case "pdf":
        return "PDF Document";
      case "video":
        return "Video Link";
      case "link":
        return "Web Resource";
      default:
        return "Resource";
    }
  };

  return (
    <>
      <style>{`
                * {
                    box-sizing: border-box;
                }
                
                .page-wrapper {
                    font-family: "Inter", sans-serif;
                    background-color: #F8F9FB;
                    min-height: 100vh;
                    padding: 2px;
                    width: 100%;
                }
                
                .header {
                    background-color: #FFFFFF;
                    padding: 32px;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .header-info {
                    flex: 1;
                }
                
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #6B7280;
                    margin-bottom: 12px;
                }
                
                .page-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #111827;
                    margin: 0 0 16px 0;
                }
                
                .instructor-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: #4B5563;
                    font-weight: 500;
                }
                
                .avatar {
                    width: 28px;
                    height: 28px;
                    background-color: #E5E7EB;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                }
                
                .progress-section {
                    width: 240px;
                }
                
                .progress-text {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .progress-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #4B5563;
                }
                
                .progress-percent {
                    font-size: 13px;
                    font-weight: 800;
                    color: #0066FF;
                }
                
                .progress-bar-bg {
                    height: 8px;
                    background-color: #E5E7EB;
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .progress-bar-fill {
                    height: 100%;
                    background-color: #0066FF;
                    border-radius: 10px;
                    transition: width 0.5s ease-out;
                }
                
                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 24px;
                    max-width: 100%;
                    margin: 0;
                }

                .tab-buttons {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .tab-btn {
                    flex: 1;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 8px;
                    background-color: #F3F4F6;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn.active {
                    background-color: #0066FF;
                    color: #FFFFFF;
                }
                
                .roadmap-col {
                    display: flex;
                    flex-direction: column;
                }
                
                .module-list {
                    display: flex;
                    flex-direction: column;
                }
                
                .timeline-connector {
                    width: 3px;
                    height: 30px;
                    background-color: #0066FF;
                    margin-left: 31px;
                    opacity: 0.2;
                    border-radius: 3px;
                }
                
                .module-card {
                    background-color: #FFFFFF;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                
                .locked-card {
                    opacity: 0.7;
                    pointer-events: none;
                }
                
                .card-header {
                    padding: 20px 24px;
                    background-color: #F9FAFB;
                    border-bottom: 1px solid #F3F4F6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .card-header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .module-number {
                    width: 45px;
                    height: 45px;
                    background-color: #FFFFFF;
                    border: 2px solid #0066FF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0066FF;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                .module-number.completed {
                    background-color: #0066FF;
                    border: none;
                    color: #FFFFFF;
                }
                
                .module-title-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .module-title {
                    font-size: 17px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .module-meta {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 4px;
                }
                
                .status-badge {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #6B7280;
                    letter-spacing: 0.05em;
                }
                
                .card-body {
                    padding: 24px;
                }
                
                .description {
                    font-size: 15px;
                    color: #4B5563;
                    line-height: 1.6;
                    margin: 0 0 24px 0;
                }
                
                .resource-header {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: #374151;
                    margin-bottom: 16px;
                    border-bottom: 1px solid #F3F4F6;
                    padding-bottom: 8px;
                }
                
                .resource-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                
                .resource-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px;
                    background-color: #F9FAFB;
                    border-radius: 10px;
                    border: 1px solid #F3F4F6;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .resource-item:hover {
                    background-color: #F3F4F6;
                    border-color: #E5E7EB;
                    transform: translateY(-1px);
                }
                
                .resource-icon {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .resource-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .resource-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }
                
                .resource-type {
                    font-size: 11px;
                    color: #9CA3AF;
                    font-weight: 500;
                }
                
                .resource-action {
                    color: #9CA3AF;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .sidebar-col {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                
                .search-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .search-icon {
                    position: absolute;
                    left: 12px;
                    color: #9CA3AF;
                }
                
                .search-input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    border-radius: 12px;
                    border: 1px solid #E5E7EB;
                    font-size: 14px;
                    outline: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .section-heading {
                    font-size: 12px;
                    font-weight: 700;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .skill-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .pagination-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                    padding: 12px 0;
                }

                .pagination-info {
                    font-size: 13px;
                    color: #6B7280;
                }

                .pagination {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .pagination-btn, .pagination-number {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #E5E7EB;
                    background: #FFFFFF;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 600;
                }

                .pagination-btn:hover:not(:disabled), .pagination-number:hover {
                    border-color: #0066FF;
                    color: #0066FF;
                }

                .pagination-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .pagination-number.active {
                    background: #0066FF;
                    color: #FFFFFF;
                    border-color: #0066FF;
                }

                .skills-toggle {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .skills-tab-btn {
                    flex: 1;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 8px;
                    background: #F3F4F6;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .skills-tab-btn.active {
                    background: #0066FF;
                    color: #FFFFFF;
                }
                
                .skill-item {
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-radius: 14px;
                    border: 1px solid #E5E7EB;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .skill-item:hover {
                    border-color: #0066FF;
                }
                
                .skill-item.active {
                    border-color: #0066FF;
                    box-shadow: 0 4px 6px -1px rgba(0, 102, 255, 0.1);
                }
                
                .skill-icon-box {
                    width: 40px;
                    height: 40px;
                    background-color: #F0F7FF;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 700;
                    color: #0066FF;
                    flex-shrink: 0;
                }
                
                .skill-info {
                    flex: 1;
                }
                
                .skill-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                }
                
                .skill-code {
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 2px;
                }
                
                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .page-wrapper {
                        padding: 20px 16px;
                    }
                    
                    .header {
                        flex-direction: column;
                        padding: 20px 16px;
                        border-radius: 12px;
                        margin-bottom: 16px;
                        gap: 20px;
                    }
                    
                    .breadcrumb {
                        font-size: 12px;
                    }
                    
                    .page-title {
                        font-size: 20px;
                    }
                    
                    .instructor-info {
                        font-size: 13px;
                    }
                    
                    .progress-section {
                        width: 100%;
                    }
                    
                    .main-content {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .sidebar-col {
                        order: -1;
                    }
                    
                    .skill-list {
                        flex-direction: row;
                        overflow-x: auto;
                        padding-bottom: 4px;
                    }
                    
                    .skill-item {
                        min-width: 200px;
                        padding: 12px;
                    }
                    
                    .skill-name {
                        font-size: 13px;
                    }
                    
                    .skill-code {
                        font-size: 11px;
                    }
                    
                    .timeline-connector {
                        height: 20px;
                        margin-left: 26px;
                    }
                    
                    .module-card {
                        border-radius: 12px;
                    }
                    
                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 16px;
                        gap: 12px;
                    }
                    
                    .card-header-left {
                        gap: 12px;
                    }
                    
                    .module-number {
                        width: 38px;
                        height: 38px;
                        font-size: 12px;
                    }
                    
                    .module-title {
                        font-size: 15px;
                    }
                    
                    .module-meta {
                        font-size: 11px;
                    }
                    
                    .status-badge {
                        font-size: 10px;
                        margin-left: 50px;
                    }
                    
                    .card-body {
                        padding: 16px;
                    }
                    
                    .description {
                        font-size: 14px;
                    }
                    
                    .resource-header {
                        font-size: 13px;
                    }
                    
                    .resource-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                    
                    .resource-item {
                        padding: 12px;
                    }
                    
                    .resource-name {
                        font-size: 12px;
                    }
                    
                    .search-input {
                        padding: 10px 10px 10px 38px;
                        border-radius: 10px;
                        font-size: 13px;
                    }
                    
                    .section-heading {
                        font-size: 11px;
                    }
                }
            `}</style>

      <div className="page-wrapper">
        <header className="header">
          <div className="header-info">
            <div className="breadcrumb">
              <Book size={16} /> Roadmap & Material{" "}
              {venue && `/ ${venue.venue_name}`}
            </div>
            <h1 className="page-title">
              {venue
                ? `Learning Roadmap - ${venue.venue_name}`
                : "My Learning Roadmap"}
            </h1>
            {venue && (
              <div className="instructor-info">
                <div className="avatar">{venue.venue_name.charAt(0)}</div>
                <span>{venue.venue_name}</span>
              </div>
            )}
          </div>
          <div className="progress-section">
            <div className="progress-text">
              <span className="progress-label">Track Progress</span>
              <span className="progress-percent">{calculateProgress()}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="roadmap-col">
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b",
                }}
              >
                <Loader
                  size={40}
                  style={{
                    margin: "0 auto 16px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p>Loading roadmap...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#ef4444",
                }}
              >
                <p>{error}</p>
              </div>
            ) : filteredModules.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b",
                }}
              >
                <BookOpen
                  size={48}
                  style={{ margin: "0 auto 16px", opacity: 0.5 }}
                />
                <p>
                  {modulesTab === "completed"
                    ? "No completed modules yet."
                    : "No active modules found."}
                </p>
                {!venue && modulesTab !== "completed" && (
                  <p style={{ fontSize: "14px", marginTop: "8px" }}>
                    You haven't been assigned to a venue.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="module-list">
                  {paginatedModules.map((module, index) => {
                    const isCompleted = isModuleCompleted(module);

                    return (
                      <div key={module.roadmap_id}>
                        {index !== 0 && <div className="timeline-connector" />}
                        <div className="module-card">
                          <div className="card-header">
                            <div className="card-header-left">
                              <div
                                className={`module-number ${isCompleted ? "completed" : ""}`}
                                onClick={() =>
                                  toggleComplete(module.roadmap_id)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 size={24} />
                                ) : (
                                  `D${module.day}`
                                )}
                              </div>
                              <div className="module-title-group">
                                <h3 className="module-title">{module.title}</h3>
                                <div className="module-meta">
                                  <Clock size={12} style={{ marginRight: 4 }} />
                                  {module.faculty_name
                                    ? `Instructor: ${module.faculty_name}`
                                    : "Estimated 2-3 hours"}
                                </div>
                              </div>
                            </div>
                            <div className="status-badge">
                              {isCompleted
                                ? "Completed"
                                : module.status === "published"
                                  ? "Available"
                                  : "Draft"}
                            </div>
                          </div>

                          <div className="card-body">
                            <p className="description">
                              {module.description || "No description provided."}
                            </p>

                            {module.resources &&
                              module.resources.length > 0 && (
                                <>
                                  <div className="resource-header">
                                    <BookOpen
                                      size={16}
                                      style={{ marginRight: 8 }}
                                    />
                                    Learning Resources (
                                    {module.resources.length})
                                  </div>

                                  <div className="resource-grid">
                                    {module.resources.map((res) => (
                                      <div
                                        key={res.resource_id}
                                        className="resource-item"
                                        onClick={() =>
                                          handleResourceAction(res)
                                        }
                                      >
                                        <div className="resource-icon">
                                          {getResourceIcon(res.resource_type)}
                                        </div>
                                        <div className="resource-info">
                                          <div className="resource-name">
                                            {res.resource_name}
                                          </div>
                                          <div className="resource-type">
                                            {getResourceTypeLabel(
                                              res.resource_type,
                                            )}
                                          </div>
                                        </div>
                                        <div className="resource-action">
                                          {res.resource_type === "pdf" ? (
                                            <Download size={14} />
                                          ) : (
                                            <ChevronRight size={14} />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredModules.length}
                />
              </>
            )}
          </div>

          <div className="sidebar-col">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="tab-buttons">
              <button
                className={`tab-btn ${modulesTab === "active" ? "active" : ""}`}
                onClick={() => {
                  setModulesTab("active");
                  setCurrentPage(1);
                }}
                type="button"
              >
                Active
              </button>
              <button
                className={`tab-btn ${modulesTab === "completed" ? "active" : ""}`}
                onClick={() => {
                  setModulesTab("completed");
                  setCurrentPage(1);
                }}
                type="button"
              >
                Completed
              </button>
            </div>

            <div className="section-heading">
              {modulesTab === "completed"
                ? `Completed Modules (${sidebarModules.length})`
                : `Active Modules (${sidebarModules.length})`}
            </div>
            <div className="skill-list">
              {sidebarModules.length === 0 && !loading ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  {modulesTab === "completed"
                    ? "No completed modules yet"
                    : "No active modules"}
                </div>
              ) : (
                sidebarModules.map((module, index) => {
                  const isCompleted = isModuleCompleted(module);
                  return (
                    <div
                      key={module.roadmap_id}
                      className="skill-item"
                      style={{ cursor: "default" }}
                    >
                      <div
                        className="skill-icon-box"
                        style={{
                          backgroundColor: isCompleted ? "#10b981" : "#3b82f6",
                        }}
                      >
                        {isCompleted ? "✓" : `D${module.day}`}
                      </div>
                      <div className="skill-info">
                        <div className="skill-name">{module.title}</div>
                        <div className="skill-code">
                          Day {module.day} • {module.resources?.length || 0}{" "}
                          resources
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRoadmap;
