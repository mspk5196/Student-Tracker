import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';
import useAuthStore from '../../../../../store/useAuthStore';

const SkillOrderManager = ({ selectedCourseType = 'frontend' }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useAuthStore();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    is_prerequisite: true,
    description: ''
  });
  const [message, setMessage] = useState({ show: false, type: '', text: '' });
  const [draggedItem, setDraggedItem] = useState(null);

  // Fetch skill order
  useEffect(() => {
    fetchSkillOrder();
    fetchAvailableSkills();
  }, [selectedCourseType]);

  const fetchSkillOrder = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/skill-order?course_type=${selectedCourseType}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Filter by course type and sort by display_order
        const filteredSkills = data.data
          .filter(s => s.course_type === selectedCourseType)
          .sort((a, b) => a.display_order - b.display_order);
        setSkills(filteredSkills);
      }
    } catch (error) {
      console.error('Error fetching skill order:', error);
      showMessage('error', 'Failed to fetch skill order');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skill-order/available-skills`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAvailableSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching available skills:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ show: true, type, text });
    setTimeout(() => setMessage({ show: false, type: '', text: '' }), 3000);
  };

  const handleAddSkill = async () => {
    if (!newSkill.skill_name.trim()) {
      showMessage('error', 'Please enter a skill name');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/skill-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_type: selectedCourseType,
          skill_name: newSkill.skill_name.trim(),
          is_prerequisite: newSkill.is_prerequisite,
          description: newSkill.description.trim() || null
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('success', 'Skill added successfully');
        setShowAddModal(false);
        setNewSkill({ skill_name: '', is_prerequisite: true, description: '' });
        fetchSkillOrder();
      } else {
        showMessage('error', data.message || 'Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      showMessage('error', 'Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Are you sure you want to delete this skill from the order?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/skill-order/${skillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        showMessage('success', 'Skill removed from order');
        fetchSkillOrder();
      } else {
        showMessage('error', data.message || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      showMessage('error', 'Failed to delete skill');
    }
  };

  const handleTogglePrerequisite = async (skillId, currentValue) => {
    try {
      const response = await fetch(`${API_URL}/skill-order/${skillId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_prerequisite: !currentValue
        })
      });

      const data = await response.json();
      if (data.success) {
        setSkills(prev => prev.map(s => 
          s.id === skillId ? { ...s, is_prerequisite: !currentValue } : s
        ));
      }
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    if (draggedItem !== index) {
      const newSkills = [...skills];
      const draggedSkill = newSkills[draggedItem];
      newSkills.splice(draggedItem, 1);
      newSkills.splice(index, 0, draggedSkill);
      
      // Update display_order for all items
      newSkills.forEach((skill, idx) => {
        skill.display_order = idx + 1;
      });
      
      setSkills(newSkills);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;
    
    setDraggedItem(null);
    
    // Save new order to backend
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/skill-order/reorder/bulk`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skills: skills.map((s, idx) => ({
            id: s.id,
            display_order: idx + 1
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        showMessage('success', 'Order saved successfully');
      } else {
        showMessage('error', 'Failed to save order');
        fetchSkillOrder(); // Revert on error
      }
    } catch (error) {
      console.error('Error saving order:', error);
      showMessage('error', 'Failed to save order');
      fetchSkillOrder();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Skill Order Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define the order in which students must complete skills. Drag to reorder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSkillOrder}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message.show && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Skills List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Loading skills...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No skills configured for this course type.</p>
          <p className="text-sm mt-1">Click "Add Skill" to create your first skill in the order.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border ${
                draggedItem === index ? 'border-blue-500 opacity-50' : 'border-gray-200'
              } cursor-move hover:bg-gray-100 transition-colors`}
            >
              <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
              
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900">{skill.skill_name}</div>
                {skill.description && (
                  <div className="text-sm text-gray-500">{skill.description}</div>
                )}
                <span className="text-xs text-gray-400">Applied to all venues</span>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skill.is_prerequisite}
                  onChange={() => handleTogglePrerequisite(skill.id, skill.is_prerequisite)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Prerequisite</span>
              </label>
              
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Skill to Order</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, skill_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                  list="available-skills"
                />
                <datalist id="available-skills">
                  {availableSkills.map((skill, idx) => (
                    <option key={idx} value={skill} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newSkill.description}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of this skill"
                  rows={2}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSkill.is_prerequisite}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, is_prerequisite: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Requires previous skill to be cleared (prerequisite)
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                disabled={saving || !newSkill.skill_name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader className="w-4 h-4 animate-spin" />}
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {saving && (
        <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default SkillOrderManager;
