import  { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

export default function App() {
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
   
    const parts = path.split('/');
    const leadId = parts[parts.length - 1];

    if (leadId) {
      fetchLead(leadId);
      fetchComments(leadId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLead = async (leadId) => {
    try {
      const response = await axios.get(`${API}/leads`);
      const foundLead = response.data.find((x) => x.id === leadId);
      setLead(foundLead);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchComments = async (leadId) => {
    try {
      const response = await axios.get(`${API}/leads/${leadId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      
      const parts = path.split('/');
      const leadId = parts[parts.length - 1];

      await axios.post(`${API}/leads/${leadId}/comments`, {
        commentText: newComment,
        author: lead.salesAgent?.id,
      });

      setNewComment('');
      fetchComments(leadId);
    } catch (error) {
      console.error(error);
    }
  };

  const updateComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const path = window.location.pathname;
      const parts = path.split('/');
      const leadId = parts[parts.length - 1];

      await axios.put(`${API}/leads/${leadId}/comments/${commentId}`, {
        commentText: editText,
      });

      setEditingId(null);
      setEditText('');
      fetchComments(leadId);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const path = window.location.pathname;
      const parts = path.split('/');
      const leadId = parts[parts.length - 1];

      await axios.delete(`${API}/leads/${leadId}/comments/${commentId}`);
      fetchComments(leadId);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!lead) {
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
            <h3>Lead not found</h3>
            <p className="text-muted">Please provide a valid lead ID in the URL</p>
            <small className="text-muted">Example: /lead/your-lead-id</small>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
  

      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
          <h4 className="mb-4">Anvaya CRM</h4>

          <div className="d-flex flex-column gap-2">
            <button
              className="btn text-white text-start border-0"
              onClick={() => (window.location.href = '/')}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4">Lead Management: {lead.name}</h2>

            {/* Lead Details */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Lead Details</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>Lead Name:</strong>
                  <p className="mb-0">{lead.name}</p>
                </div>
                <div className="mb-3">
                  <strong>Sales Agent:</strong>
                  <p className="mb-0">{lead.salesAgent?.name || 'Unassigned'}</p>
                </div>
                <div className="mb-3">
                  <strong>Lead Source:</strong>
                  <p className="mb-0">{lead.source}</p>
                </div>
                <div className="mb-3">
                  <strong>Lead Status:</strong>
                  <p className="mb-0">
                    <span className="badge bg-secondary">{lead.status}</span>
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Priority:</strong>
                  <p className="mb-0">
                    <span
                      className={`badge ${
                        lead.priority === 'High'
                          ? 'bg-danger'
                          : lead.priority === 'Medium'
                          ? 'bg-warning'
                          : 'bg-success'
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </p>
                </div>
                <div className="mb-3">
                  <strong>Time to Close:</strong>
                  <p className="mb-0">{lead.timeToClose} Days</p>
                </div>
                {lead.tags && lead.tags.length > 0 && (
                  <div className="mb-3">
                    <strong>Tags:</strong>
                    <div className="mt-2">
                      {lead.tags.map((tag, index) => (
                        <span key={index} className="badge bg-info me-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button className="btn btn-warning w-100 mt-3">Edit Lead Details</button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Comments Section</h5>
              </div>
              <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {comments.length === 0 ? (
                  <p className="text-muted text-center py-4">No comments yet</p>
                ) : (
                  <div>
                    {comments.map((comment, index) => (
                      <div key={index} className="border-bottom pb-3 mb-3">
                        {editingId === comment.id ? (
                          <div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => updateComment(comment.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditText('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <strong>{comment.author}</strong>
                              <div className="d-flex gap-2 align-items-center">
                                <small className="text-muted">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </small>
                                <button
                                  className="btn btn-sm btn-outline-primary border-0"
                                  onClick={() => {
                                    setEditingId(comment.id);
                                    setEditText(comment.commentText);
                                  }}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger border-0"
                                  onClick={() => deleteComment(comment.id)}
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p className="mb-0">Comment: {comment.commentText}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="mb-2">
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
      </div>
    </>
  );
}
