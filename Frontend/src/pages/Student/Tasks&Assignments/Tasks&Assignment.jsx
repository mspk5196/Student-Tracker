import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  CloudUpload,
  FileText,
  X,
  ChevronLeft,
  ExternalLink,
  BookOpen,
  Download,
  Loader,
} from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const TasksAssignments = () => {
  const { token, user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const MATERIALS_BY_TASK = {
    1: [
      {
        type: "link",
        name: "React Hooks Overview",
        url: "https://react.dev/learn/hooks-overview",
        provider: "Faculty",
      },
      {
        type: "file",
        name: "Hooks_Workshop.pdf",
        fileUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        provider: "Uploaded file",
      },
    ],
    2: [
      {
        type: "link",
        name: "Lifecycle & Effects Guide",
        url: "https://react.dev/learn/synchronizing-with-effects",
        provider: "Faculty",
      },
    ],
    3: [
      {
        type: "link",
        name: "Reusable Components Patterns",
        url: "https://kentcdodds.com/blog/application-state-management-with-react",
        provider: "Faculty",
      },
    ],
    4: [
      {
        type: "link",
        name: "Complete Guide to CSS Grid",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
        provider: "Faculty",
      },
    ],
    5: [
      {
        type: "link",
        name: "Flexbox Interactive Practice",
        url: "https://flexboxfroggy.com/",
        provider: "Faculty",
      },
    ],
    6: [
      {
        type: "link",
        name: "Async/Await MDN Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await",
        provider: "Faculty",
      },
    ],
    7: [
      {
        type: "link",
        name: "Modern JavaScript Features",
        url: "https://exploringjs.com/es6/",
        provider: "Faculty",
      },
    ],
    8: [
      {
        type: "link",
        name: "REST API Best Practices",
        url: "https://restfulapi.net/",
        provider: "Faculty",
      },
    ],
    9: [
      {
        type: "link",
        name: "MongoDB Integration Guide",
        url: "https://www.mongodb.com/developer/languages/javascript/node-crud-tutorial/",
        provider: "Faculty",
      },
    ],
    10: [
      {
        type: "link",
        name: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        provider: "Faculty",
      },
    ],
    11: [
      {
        type: "link",
        name: "Context API Walkthrough",
        url: "https://react.dev/learn/passing-data-deeply-with-context",
        provider: "Faculty",
      },
    ],
    14: [
      {
        type: "link",
        name: "CSS Animations Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations",
        provider: "Faculty",
      },
    ],
    17: [
      {
        type: "link",
        name: "Functional Programming Basics",
        url: "https://mostly-adequate.gitbook.io/mostly-adequate-guide/",
        provider: "Faculty",
      },
    ],
    18: [
      {
        type: "link",
        name: "Design Patterns in JS",
        url: "https://www.patterns.dev/",
        provider: "Faculty",
      },
    ],
    20: [
      {
        type: "link",
        name: "Interfaces vs Types",
        url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        provider: "Faculty",
      },
    ],
    22: [
      {
        type: "link",
        name: "Server Components Intro",
        url: "https://nextjs.org/docs/getting-started/react-essentials",
        provider: "Faculty",
      },
    ],
    23: [
      {
        type: "link",
        name: "Middleware in Next.js",
        url: "https://nextjs.org/docs/app/building-your-application/routing/middleware",
        provider: "Faculty",
      },
    ],
  };
  // --- MOCK DATA FOR STUDENT TASKS ---
  const TASKS_DATA = {
    "REACT-101": {
      title: "React Mastery Workshop",
      instructor: "Prof. Sarah Johnson",
      tasks: [
        {
          id: 1,
          day: 1,
          title: "React Hooks Implementation",
          description:
            "Implement useState and useEffect hooks in a simple counter application.",
          dueDate: "2024-10-30",
          status: "completed",
          score: 50,
          submittedDate: "2024-10-29",
          grade: "45/50",
        },
        {
          id: 2,
          day: 3,
          title: "Component Lifecycle Quiz",
          description:
            "Complete a comprehensive quiz on React component lifecycle and hooks.",
          dueDate: "2024-11-05",
          status: "pending",
          score: 100,
          submittedDate: null,
        },
        {
          id: 3,
          day: 5,
          title: "Advanced Patterns Project",
          description:
            "Build a reusable component library with advanced patterns.",
          dueDate: "2024-11-12",
          status: "pending",
          score: 75,
        },
        {
          id: 11,
          day: 7,
          title: "State Management with Context API",
          description:
            "Implement global state management using React Context API.",
          dueDate: "2024-11-15",
          status: "pending",
          score: 60,
        },
        {
          id: 12,
          day: 9,
          title: "Custom Hooks Development",
          description: "Create custom React hooks for common functionality.",
          dueDate: "2024-11-18",
          status: "pending",
          score: 70,
        },
        {
          id: 13,
          day: 11,
          title: "React Router Integration",
          description: "Build a multi-page application using React Router.",
          dueDate: "2024-11-22",
          status: "pending",
          score: 85,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
    "CSS-201": {
      title: "HTML & CSS Fundamentals",
      instructor: "Prof. Michael Chen",
      tasks: [
        {
          id: 4,
          day: 1,
          title: "CSS Grid Layout Project",
          description: "Create a responsive dashboard layout using CSS Grid.",
          dueDate: "2024-11-01",
          status: "overdue",
          score: 75,
        },
        {
          id: 5,
          day: 2,
          title: "Flexbox Challenge",
          description: "Design a flexible card layout using Flexbox.",
          dueDate: "2024-11-02",
          status: "completed",
          score: 80,
          submittedDate: "2024-11-01",
          grade: "78/80",
        },
        {
          id: 14,
          day: 4,
          title: "CSS Animations Project",
          description:
            "Create smooth animations using CSS transitions and keyframes.",
          dueDate: "2024-11-08",
          status: "pending",
          score: 65,
        },
        {
          id: 15,
          day: 6,
          title: "Responsive Design Challenge",
          description:
            "Build a fully responsive landing page for mobile, tablet, and desktop.",
          dueDate: "2024-11-14",
          status: "pending",
          score: 90,
        },
        {
          id: 16,
          day: 8,
          title: "CSS Variables and Theming",
          description:
            "Implement a dynamic theme system using CSS custom properties.",
          dueDate: "2024-11-20",
          status: "pending",
          score: 55,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
    "JS-301": {
      title: "JavaScript Advanced Concepts",
      instructor: "Prof. Emily Rodriguez",
      tasks: [
        {
          id: 6,
          day: 1,
          title: "Async/Await Patterns",
          description: "Master asynchronous programming with async/await.",
          dueDate: "2024-11-03",
          status: "completed",
          score: 70,
          submittedDate: "2024-11-02",
          grade: "68/70",
        },
        {
          id: 7,
          day: 3,
          title: "ES6+ Features Quiz",
          description: "Test your knowledge of modern JavaScript features.",
          dueDate: "2024-11-10",
          status: "pending",
          score: 100,
        },
        {
          id: 17,
          day: 5,
          title: "Functional Programming",
          description: "Apply functional programming concepts in JavaScript.",
          dueDate: "2024-11-17",
          status: "pending",
          score: 80,
        },
        {
          id: 18,
          day: 7,
          title: "Design Patterns Implementation",
          description: "Implement common design patterns in JavaScript.",
          dueDate: "2024-11-24",
          status: "pending",
          score: 95,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
    "NODE-401": {
      title: "Node.js Backend Development",
      instructor: "Prof. David Kim",
      tasks: [
        {
          id: 8,
          day: 1,
          title: "REST API Development",
          description: "Build a RESTful API with Express.js.",
          dueDate: "2024-11-06",
          status: "pending",
          score: 100,
        },
        {
          id: 9,
          day: 3,
          title: "Database Integration",
          description: "Connect MongoDB to your Node.js application.",
          dueDate: "2024-11-13",
          status: "pending",
          score: 85,
        },
        {
          id: 19,
          day: 5,
          title: "Authentication & Authorization",
          description: "Implement JWT-based authentication system.",
          dueDate: "2024-11-19",
          status: "pending",
          score: 90,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
    "TS-501": {
      title: "TypeScript Fundamentals",
      instructor: "Prof. Lisa Wang",
      tasks: [
        {
          id: 10,
          day: 1,
          title: "Type Annotations Exercise",
          description: "Practice adding type annotations to JavaScript code.",
          dueDate: "2024-11-09",
          status: "pending",
          score: 60,
        },
        {
          id: 20,
          day: 3,
          title: "Interfaces and Types",
          description:
            "Define complex data structures using interfaces and types.",
          dueDate: "2024-11-16",
          status: "pending",
          score: 70,
        },
        {
          id: 21,
          day: 5,
          title: "Generics Deep Dive",
          description: "Create reusable components using TypeScript generics.",
          dueDate: "2024-11-23",
          status: "pending",
          score: 80,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
    "NEXT-601": {
      title: "Next.js Full-Stack Development",
      instructor: "Prof. Robert Brown",
      tasks: [
        {
          id: 22,
          day: 1,
          title: "Server Components",
          description: "Build a blog using Next.js 14 server components.",
          dueDate: "2024-11-11",
          status: "pending",
          score: 100,
        },
        {
          id: 23,
          day: 3,
          title: "API Routes & Middleware",
          description: "Implement API routes with custom middleware.",
          dueDate: "2024-11-18",
          status: "pending",
          score: 85,
        },
      ].map((task) => ({
        ...task,
        materials: MATERIALS_BY_TASK[task.id] || [],
      })),
    },
  };

  // State management
  const [tasksData, setTasksData] = useState({});
  const [venueInfo, setVenueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("REACT-101");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionType, setSubmissionType] = useState("file");
  const [uploadFile, setUploadFile] = useState(null);
  const [externalLink, setExternalLink] = useState("");
  const [completedTasks, setCompletedTasks] = useState([1, 5, 6]);
  const [skillsTab, setSkillsTab] = useState("active");

  // Pagination states
  const [currentSubjectPage, setCurrentSubjectPage] = useState(1);
  const subjectsPerPage = 5;

  // Fetch tasks from backend
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/tasks/student`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      
      if (data.success) {
        setTasksData(data.data.groupedTasks || {});
        setVenueInfo({
          venue_name: data.data.venue_name,
          venue_id: data.data.venue_id,
          student_id: data.data.student_id
        });
        
        // Set first subject as selected
        const firstKey = Object.keys(data.data.groupedTasks || {})[0];
        if (firstKey) {
          setSelectedSubject(firstKey);
        }

        // Extract completed task IDs
        const completedIds = [];
        Object.values(data.data.groupedTasks || {}).forEach(subject => {
          subject.tasks.forEach(task => {
            if (task.status === 'completed') {
              completedIds.push(task.id);
            }
          });
        });
        setCompletedTasks(completedIds);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching student tasks:', err);
      setError(`Failed to load tasks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Use real data from backend
  const DISPLAY_TASKS_DATA = tasksData;
  const subjectData = DISPLAY_TASKS_DATA[selectedSubject];
  const allTasks = subjectData?.tasks || [];

  const filteredTasks = allTasks.filter((task) => {
    const q = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q)
    );
  });

  // Pagination calculations for subjects
  const subjectKeys = Object.keys(DISPLAY_TASKS_DATA);

  // Filter subjects based on skillsTab (active/completed)
  const filteredSubjectKeys = subjectKeys.filter((key) => {
    const subjectTasks = DISPLAY_TASKS_DATA[key].tasks;
    const allTasksCompleted = subjectTasks.every(
      (task) => task.status === "completed"
    );
    const hasActiveTasks = subjectTasks.some(
      (task) => task.status !== "completed"
    );

    if (skillsTab === "active") return hasActiveTasks;
    if (skillsTab === "completed") return allTasksCompleted;
    return true;
  });

  const totalSubjectPages = Math.ceil(
    filteredSubjectKeys.length / subjectsPerPage
  );
  const subjectStartIdx = (currentSubjectPage - 1) * subjectsPerPage;
  const subjectEndIdx = subjectStartIdx + subjectsPerPage;
  const paginatedSubjects = filteredSubjectKeys.slice(
    subjectStartIdx,
    subjectEndIdx
  );

  const calculateProgress = () => {
    if (!allTasks.length) return 0;
    const completed = allTasks.filter((t) => t.status === "completed").length;
    return Math.round((completed / allTasks.length) * 100);
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const submitAssignment = async () => {
    if (submissionType === "file" && !uploadFile) {
      alert("Please upload a file before submitting.");
      return;
    }
    if (submissionType === "link" && !externalLink) {
      alert("Please provide a link before submitting.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('submission_type', submissionType);
    
    if (submissionType === 'file' && uploadFile) {
      formData.append('file', uploadFile);
    } else if (submissionType === 'link') {
      formData.append('link_url', externalLink);
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || 'Assignment submitted successfully!');
        setCompletedTasks((prev) => [...new Set([...prev, selectedTask.id])]);
        closeModal();
        fetchTasks(); // Refresh tasks
      } else {
        alert(data.message || 'Failed to submit assignment');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
    setUploadFile(null);
    setExternalLink("");
    setSubmissionType("file");
  };

  const handleSubjectChange = (key) => {
    setSelectedSubject(key);
    setSearchQuery("");
  };

  const openMaterial = (material) => {
    const link = material.url || material.fileUrl;
    if (!link) {
      alert("No reference link available yet.");
      return;
    }
    
    // If it's a download link from backend, add API_URL prefix
    if (material.fileUrl && material.fileUrl.includes('/api/roadmap/resources/download/')) {
      window.open(`${API_URL}${material.fileUrl}`, '_blank');
    } else {
      window.open(link, "_blank");
    }
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 3;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 2) {
          pages.push(1, 2, 3);
        } else if (currentPage >= totalPages - 1) {
          pages.push(totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(currentPage - 1, currentPage, currentPage + 1);
        }
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="pagination-wrapper">
        <span className="pagination-info">
          Showing {(currentPage - 1) * subjectsPerPage + 1}-
          {Math.min(currentPage * subjectsPerPage, totalPages)} items
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
              className={`pagination-number ${
                currentPage === page ? "active" : ""
              }`}
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

  return (
    <>
      <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { margin: 0; }
                .page-wrapper { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background-color: #F8F9FB; min-height: 100vh; padding:6px; }
                .header { background-color: #FFFFFF; padding: 32px; border-radius: 16px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .header-info { flex: 1; }
                .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6B7280; margin-bottom: 12px; }
                .page-title { font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 16px 0; }
                .subtext-header { font-size: 14px; color: #4B5563; margin: 0; }
                .progress-section { width: 240px; }
                .progress-text { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .progress-label { font-size: 13px; font-weight: 600; color: #4B5563; }
                .progress-percent { font-size: 13px; font-weight: 800; color: #0066FF; }
                .progress-bar-bg { height: 8px; background-color: #E5E7EB; border-radius: 10px; overflow: hidden; }
                .progress-bar-fill { height: 100%; background-color: #0066FF; border-radius: 10px; transition: width 0.5s ease-out; }
                .main-content { display: grid; grid-template-columns: 1fr 340px; gap: 24px; max-width: 1400px; margin: 0 auto; }
                .task-col { display: flex; flex-direction: column; }
                .task-card { background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; margin-bottom: 16px; transition: box-shadow 0.2s; }
                .task-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .card-header { padding: 20px 24px; background-color: #F9FAFB; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
                .card-header-left { display: flex; align-items: center; gap: 16px; }
                .task-number { width: 45px; height: 45px; background-color: #FFFFFF; border: 2px solid #0066FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0066FF; font-size: 14px; font-weight: 800; cursor: pointer; flex-shrink: 0; }
                .task-number.completed { background-color: #0066FF; border: none; color: #FFFFFF; }
                .task-title-group { display: flex; flex-direction: column; }
                .task-title { font-size: 17px; font-weight: 700; color: #111827; margin: 0; }
                .task-meta { display: flex; align-items: center; font-size: 12px; color: #6B7280; margin-top: 4px; }
                .status-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6B7280; letter-spacing: 0.05em; padding: 6px 12px; background: #F3F4F6; border-radius: 6px; }
                .card-body { padding: 24px; }
                .description { font-size: 15px; color: #4B5563; line-height: 1.6; margin: 0 0 24px 0; }
                .reference-section { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin: 0 0 18px 0; }
                .reference-header { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 14px; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px; }
                .reference-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .reference-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background-color: #F9FAFB; border-radius: 10px; border: 1px solid #F3F4F6; cursor: pointer; transition: all 0.2s; }
                .reference-item:hover { background-color: #F3F4F6; }
                .ref-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #EEF2FF; color: #4338CA; }
                .ref-title { flex: 1; font-size: 14px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ref-meta { font-size: 12px; color: #64748B; margin-top: 2px; }
                .ref-text { flex: 1; display: flex; flex-direction: column; gap: 2px; line-height: 1.35; }
                .ref-action { margin-left: auto; color: #9CA3AF; flex-shrink: 0; display: flex; align-items: center; }
                .reference-empty { font-size: 13px; color: #94A3B8; padding: 12px 14px; border: 1px dashed #E5E7EB; border-radius: 10px; background: #FFFFFF; margin: 0 0 12px 0; }
                .action-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #F3F4F6; }
                .action-btn { background: transparent; border: none; color: #0066FF; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s; }
                .action-btn:hover { opacity: 0.8; }
                .grade-info { font-size: 13px; color: #16A34A; font-weight: 500; }
                .empty-state { text-align: center; padding: 60px 40px; background-color: #FFFFFF; border-radius: 14px; border: 1px dashed #CBD5E1; color: #64748B; }
                .sidebar-col { display: flex; flex-direction: column; gap: 24px; }
                .search-box { position: relative; display: flex; align-items: center; }
                .search-icon { position: absolute; left: 12px; color: #9CA3AF; pointer-events: none; }
                .search-input { width: 100%; padding: 12px 12px 12px 40px; border-radius: 12px; border: 1px solid #E5E7EB; font-size: 14px; outline: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: border 0.2s; }
                .search-input:focus { border-color: #0066FF; }
                .section-heading { font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
                .subject-list { display: flex; flex-direction: column; gap: 10px; }
                .subject-item { padding: 16px; background-color: #FFFFFF; border-radius: 14px; border: 1px solid #E5E7EB; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; }
                .subject-item:hover { border-color: #0066FF; transform: translateY(-1px); }
                .subject-item.active { border-color: #0066FF; box-shadow: 0 4px 6px -1px rgba(0, 102, 255, 0.1); }
                .subject-icon-box { width: 40px; height: 40px; background-color: #F0F7FF; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #0066FF; flex-shrink: 0; }
                .subject-info { flex: 1; }
                .subject-name { font-size: 14px; font-weight: 600; color: #111827; }
                .subject-code { font-size: 12px; color: #6B7280; margin-top: 2px; }
                .pagination-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding: 16px 0; }
                .pagination-info { font-size: 13px; color: #6B7280; }
                .pagination { display: flex; gap: 8px; align-items: center; }
                .pagination-btn { width: 36px; height: 36px; border: 1px solid #E5E7EB; background: #FFFFFF; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #6B7280; }
                .pagination-btn:hover:not(:disabled) { border-color: #0066FF; color: #0066FF; }
                .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .pagination-number { width: 36px; height: 36px; border: 1px solid #E5E7EB; background: #FFFFFF; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #6B7280; font-size: 14px; font-weight: 600; }
                .pagination-number:hover { border-color: #0066FF; color: #0066FF; }
                .pagination-number.active { background: #0066FF; color: #FFFFFF; border-color: #0066FF; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
                .modal-content { background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 540px; overflow: hidden; max-height: 90vh; overflow-y: auto; }
                .modal-header { padding: 20px 24px; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; }
                .modal-title { font-size: 18px; font-weight: 700; margin: 0; }
                .close-btn { background: transparent; border: none; color: #64748B; cursor: pointer; padding: 4px; transition: color 0.2s; }
                .close-btn:hover { color: #0066FF; }
                .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
                .task-info { margin-bottom: 8px; }
                .task-info-name { font-size: 16px; font-weight: 700; margin: 0 0 8px 0; }
                .task-info-desc { font-size: 14px; color: #64748B; line-height: 1.5; margin: 0; }
                .type-toggle { display: flex; gap: 10px; background-color: #F1F5F9; padding: 4px; border-radius: 10px; }
                .toggle-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; color: #64748B; background: transparent; cursor: pointer; transition: all 0.2s; }
                .toggle-btn.active { background: #FFFFFF; color: #0066FF; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .upload-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; border: 2px dashed #E2E8F0; border-radius: 12px; cursor: pointer; transition: border-color 0.2s; }
                .upload-box:hover { border-color: #0066FF; }
                .file-selected { display: flex; flex-direction: column; align-items: center; gap: 6px; }
                .file-name { font-size: 14px; font-weight: 600; color: #1E293B; text-align: center; word-break: break-word; }
                .file-size { font-size: 12px; color: #94A3B8; }
                .upload-prompt { font-size: 14px; font-weight: 600; color: #1E293B; margin-top: 12px; text-align: center; }
                .upload-sub { font-size: 12px; color: #94A3B8; margin-top: 4px; text-align: center; }
                .link-section { display: flex; flex-direction: column; gap: 10px; }
                .input-label { font-size: 13px; font-weight: 600; color: #334155; }
                .link-input-wrapper { position: relative; display: flex; align-items: center; }
                .link-icon { position: absolute; left: 12px; color: #94A3B8; pointer-events: none; }
                .link-input { width: 100%; padding: 12px 12px 12px 40px; border-radius: 10px; border: 1px solid #E2E8F0; font-size: 14px; outline: none; transition: border 0.2s; }
                .link-input:focus { border-color: #0066FF; }
                .submit-btn { width: 100%; padding: 14px; background: #0066FF; color: #FFFFFF; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; transition: opacity 0.2s; }
                .submit-btn:hover { opacity: 0.9; }
                @media (max-width: 1024px) {
                    .main-content { grid-template-columns: 1fr; }
                    .pagination-wrapper { flex-direction: column; gap: 12px; align-items: flex-start; }
                }
                @media (max-width: 768px) {
                    .page-wrapper { padding: 16px; }
                    .header { flex-direction: column; padding: 20px; gap: 20px; align-items: flex-start; }
                    .progress-section { width: 100%; }
                    .page-title { font-size: 22px; }
                    .main-content { gap: 16px; }
                    .subject-list { flex-direction: row; overflow-x: auto; padding-bottom: 8px; }
                    .subject-item { min-width: 200px; }
                    .modal-content { border-radius: 16px 16px 0 0; max-height: 85vh; }
                    .card-header { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .status-badge { align-self: flex-start; }
                    .reference-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 480px) {
                    .pagination { flex-wrap: wrap; }
                    .pagination-info { font-size: 12px; }
                    .action-footer { flex-direction: column; gap: 12px; align-items: flex-start; }
                  .reference-grid { grid-template-columns: 1fr; }
                }
            `}</style>

      {loading ? (
        <div className="page-wrapper">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            gap: '16px'
          }}>
            <Loader size={48} color="#0066FF" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading assignments...</p>
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error && Object.keys(DISPLAY_TASKS_DATA).length === 0 ? (
        <div className="page-wrapper">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            gap: '16px'
          }}>
            <AlertCircle size={48} color="#EF4444" />
            <p style={{ fontSize: '16px', color: '#6B7280', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
            <button 
              onClick={fetchTasks}
              style={{
                padding: '10px 24px',
                background: '#0066FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="page-wrapper">
        <header className="header">
          <div className="header-info">
            <div className="breadcrumb">
              <ClipboardCheck size={16} /> Tasks & Assignments /{" "}
              {selectedSubject}
            </div>
            <h1 className="page-title">{subjectData?.title}</h1>
            <p className="subtext-header">
              {subjectData?.instructor ? `Instructor: ${subjectData.instructor}` : 'Manage your assignments and track submissions'}
              {venueInfo && ` • Venue: ${venueInfo.venue_name}`}
            </p>
          </div>
          <div className="progress-section">
            <div className="progress-text">
              <span className="progress-label">Completion</span>
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
          <div className="task-col">
            {filteredTasks.length > 0 ? (
              <>
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === "completed";
                  return (
                    <div key={task.id} className="task-card">
                      <div className="card-header">
                        <div className="card-header-left">
                          <div
                            className={`task-number ${
                              isCompleted ? "completed" : ""
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={24} />
                            ) : (
                              `D${task.day}`
                            )}
                          </div>
                          <div className="task-title-group">
                            <h3 className="task-title">{task.title}</h3>
                            <div className="task-meta">
                              <Clock size={12} style={{ marginRight: 4 }} /> Due{" "}
                              {task.dueDate}
                            </div>
                          </div>
                        </div>
                        <div className="status-badge">
                          {isCompleted
                            ? "Completed"
                            : task.status === "overdue"
                            ? "Overdue"
                            : "Pending"}
                        </div>
                      </div>

                      <div className="card-body">
                        <p className="description">{task.description}</p>
                        <div className="reference-section">
                          <div className="reference-header">
                            <BookOpen size={16} /> Reference Material
                          </div>
                          {task.materials && task.materials.length ? (
                            <div className="reference-grid">
                              {task.materials.map((material) => (
                                <div
                                  key={`${task.id}-${material.name}`}
                                  className="reference-item"
                                  onClick={() => openMaterial(material)}
                                >
                                  <div className="ref-icon">
                                    {material.type === "link" ? (
                                      <ExternalLink size={16} />
                                    ) : (
                                      <FileText size={16} />
                                    )}
                                  </div>
                                  <div className="ref-text">
                                    <div className="ref-title">
                                      {material.name}
                                    </div>
                                    <div className="ref-meta">
                                      {material.type === "link"
                                        ? "External link"
                                        : "Faculty file"}
                                      {material.provider
                                        ? ` • ${material.provider}`
                                        : " • Faculty"}
                                    </div>
                                  </div>
                                  <div className="ref-action">
                                    {material.type === "file" ? (
                                      <Download size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="reference-empty">
                              Reference material will show here once the faculty
                              shares it.
                            </div>
                          )}
                        </div>
                        <div className="action-footer">
                          <div style={{ color: "#64748B", fontSize: 13 }}>
                            {task.score ? `Max Score: ${task.score}` : ""}
                          </div>
                          <div>
                            {task.status === "completed" ? (
                              <div className="grade-info">
                                Submitted • Grade: {task.grade || "Pending"}
                              </div>
                            ) : (
                              <button
                                className="action-btn"
                                onClick={() => setSelectedTask(task)}
                              >
                                View & Submit <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="empty-state">
                <AlertCircle size={48} color="#94A3B8" />
                <p>No tasks found.</p>
              </div>
            )}
          </div>

          <div className="sidebar-col">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
              >
                <button
                  onClick={() => {
                    setSkillsTab("active");
                    setCurrentSubjectPage(1);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      skillsTab === "active" ? "#0066FF" : "#F3F4F6",
                    color: skillsTab === "active" ? "#FFFFFF" : "#6B7280",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setSkillsTab("completed");
                    setCurrentSubjectPage(1);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      skillsTab === "completed" ? "#0066FF" : "#F3F4F6",
                    color: skillsTab === "completed" ? "#FFFFFF" : "#6B7280",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Completed
                </button>
              </div>
              <div className="section-heading">Skills</div>
              <div className="subject-list">
                {paginatedSubjects.map((key) => (
                  <div
                    key={key}
                    className={`subject-item ${
                      selectedSubject === key ? "active" : ""
                    }`}
                    onClick={() => handleSubjectChange(key)}
                  >
                    <div className="subject-icon-box">{key.charAt(0)}</div>
                    <div className="subject-info">
                      <div className="subject-name">
                        {DISPLAY_TASKS_DATA[key].title}
                      </div>
                      <div className="subject-code">{key}</div>
                    </div>
                    {selectedSubject === key && (
                      <ChevronRight size={16} color="#0066FF" />
                    )}
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={currentSubjectPage}
                totalPages={totalSubjectPages}
                onPageChange={setCurrentSubjectPage}
              />
            </div>
          </div>
        </div>

        {/* Submission Modal */}
        {selectedTask && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Submit Assignment</h3>
                <button className="close-btn" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="task-info">
                  <h4 className="task-info-name">{selectedTask.title}</h4>
                  <p className="task-info-desc">
                    {selectedTask.description ||
                      "No additional instructions provided."}
                  </p>
                </div>

                <div className="type-toggle">
                  <button
                    className={`toggle-btn ${
                      submissionType === "file" ? "active" : ""
                    }`}
                    onClick={() => setSubmissionType("file")}
                  >
                    File Upload
                  </button>
                  <button
                    className={`toggle-btn ${
                      submissionType === "link" ? "active" : ""
                    }`}
                    onClick={() => setSubmissionType("link")}
                  >
                    Link Submission
                  </button>
                </div>

                {submissionType === "file" ? (
                  <div>
                    <input
                      type="file"
                      id="task-upload"
                      hidden
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="task-upload" className="upload-box">
                      {uploadFile ? (
                        <div className="file-selected">
                          <FileText size={32} color="#0066FF" />
                          <span className="file-name">{uploadFile.name}</span>
                          <span className="file-size">
                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ) : (
                        <>
                          <CloudUpload size={32} color="#94A3B8" />
                          <div className="upload-prompt">
                            Click to upload or drag and drop
                          </div>
                          <div className="upload-sub">
                            PDF, Word Docs or Images (Max 10MB)
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="link-section">
                    <label className="input-label">
                      External URL (GitHub, Drive, etc)
                    </label>
                    <div className="link-input-wrapper">
                      <ExternalLink size={18} className="link-icon" />
                      <input
                        className="link-input"
                        placeholder="Paste your link here..."
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <button
                  className="submit-btn"
                  onClick={submitAssignment}
                  disabled={submitting || (!uploadFile && !externalLink)}
                  style={{ 
                    opacity: (uploadFile || externalLink) && !submitting ? 1 : 0.6,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
};

export default TasksAssignments;