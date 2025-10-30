import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000';

export default function Lead() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // fields for update form
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    salesAgent: '',
    status: '',
    tags: '',
    timeToClose: '',
    priority: '',
  });

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (id) {
      getLead(id);
      getComments(id);
      getAgents();
    } else {
      setLoading(false);
    }
  }, [id]);

  const getAgents = async () => {
    try {
      const res = await axios.get(`${API}/agents`);
      setAgents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLead = async (id) => {
    try {
      const res = await axios.get(`${API}/leads`);
      const foundLead = res.data.find((x) => x.id === id);
      setLead(foundLead);
      setFormData({
        name: foundLead.name || '',
        source: foundLead.source || '',
        salesAgent: foundLead.salesAgent?.id || '',
        status: foundLead.status || '',
        tags: foundLead.tags?.join(', ') || '',
        timeToClose: foundLead.timeToClose || '',
        priority: foundLead.priority || '',
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getComments = async (id) => {
    try {
      const res = await axios.get(`${API}/leads/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${API}/leads/${id}/comments`, {
        commentText: newComment,
        author: lead.salesAgent?.id,
      });
      setNewComment('');
      getComments(id);
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.commentText);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (cid) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`${API}/leads/${id}/comments/${cid}`, {
        commentText: editText,
      });
      setEditingId(null);
      setEditText('');
      getComments(id);
    } catch (err) {
      console.error(err);
      alert('Failed to update comment');
    }
  };

  const deleteComment = async (cid) => {
    const confirm = window.confirm('Delete this comment?');
    if (!confirm) return;
    try {
      await axios.delete(`${API}/leads/${id}/comments/${cid}`);
      getComments(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment');
    }
  };

  const updateLead = async () => {
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()),
      };
      await axios.put(`${API}/leads/${id}`, payload);
      alert('Lead updated successfully!');
      setShowUpdateForm(false);
      getLead(id);
    } catch (err) {
      console.error(err);
      alert('Failed to update lead');
    }
  };

  if (!lead) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <h3>Lead not found</h3>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h4 className="mb-4">Anvaya CRM</h4>
        <Link className="btn text-white text-start border-0" to={`/`}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex-fill overflow-auto bg-light">
        <div className="container-fluid p-4">
          <h2 className="mb-4">Lead Management: {lead.name}</h2>

          {loading && (
            <div className="d-flex align-items-center justify-content-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Lead Details */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Lead Details</h5>
            </div>
            <div className="card-body">
              {

                <>
                <p><strong>Lead Name:</strong> {lead.name}</p>
                <p><strong>Sales Agent:</strong> {lead.salesAgent?.name || 'Unassigned'}</p>
                <p><strong>Lead Source:</strong> {lead.source}</p>
                <p><strong>Status:</strong> {lead.status}</p>
                <p><strong>Priority:</strong> {lead.priority}</p>
                <p><strong>Time to Close:</strong> {lead.timeToClose} Days</p>
                <p><strong>Tags:</strong> {lead.tags?.join(', ')}</p>
                {!showUpdateForm &&     <button className="btn btn-warning w-100 mt-3" onClick={() => setShowUpdateForm(true)}>
                    Edit Lead Details
                  </button>}
                   {showUpdateForm &&     <button className="btn btn-primary w-100 mt-3"  >
                      you can update your details below 
                  </button>}
                </>
              
            }
               
              {showUpdateForm  && (
                <>
               
                  <div className="mb-3">
                    
                    <label className="form-label">Lead Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Sales Agent</label>
                    <select
                      className="form-select"
                      value={formData.salesAgent}
                      onChange={(e) => setFormData({ ...formData, salesAgent: e.target.value })}
                    >
                      <option value="">Select Sales Agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lead Source</label>
                    <select
                      className="form-select"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                      <option>Website</option>
                      <option>Referral</option>
                      <option>Cold Call</option>
                      <option>Advertisement</option>
                      <option>Email</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Proposal Sent</option>
                      <option>Closed</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Time to Close (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.timeToClose}
                      onChange={(e) => setFormData({ ...formData, timeToClose: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-success w-50" onClick={updateLead}>
                      Save Changes
                    </button>
                    <button className="btn btn-secondary w-50" onClick={() => setShowUpdateForm(false)}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
            
          {/* Comments */}
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Comments Section</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <p className="text-muted text-center py-4">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border-bottom pb-3 mb-3">
                    {editingId === c.id ? (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success" onClick={() => saveEdit(c.id)}>
                            Save
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between mb-2">
                          <strong>{c.author}</strong>
                          <div className="d-flex gap-2 align-items-center">
                            <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
                            <button
                              className="btn btn-sm btn-outline-primary border-0"
                              onClick={() => startEdit(c)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => deleteComment(c.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="mb-0">Comment: {c.commentText}</p>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="card-footer">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Add New Comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
              />
              <button className="btn btn-success w-100" onClick={addComment}>
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
