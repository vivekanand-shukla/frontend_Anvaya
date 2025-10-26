import { useState, useEffect } from 'react';
import { useParams ,Link } from 'react-router-dom';
import axios from 'axios';


const API = 'http://localhost:3000';

export default function Lead() {
  // Get lead ID from URL using useParams
  const { id } = useParams();

  // State variables
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');


  useEffect(() => {
    if (id) {
      getLead(id);
      getComments(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Get lead details
  const getLead = async (id) => {
    try {
      const response = await axios.get(`${API}/leads`);
      const foundLead = response.data.find((x) => x.id === id);
      setLead(foundLead);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Get all comments for this lead
  const getComments = async (id) => {
    try {
      const response = await axios.get(`${API}/leads/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Add a new comment
  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`${API}/leads/${id}/comments`, {
        commentText: newComment,
        author: lead.salesAgent?.id,
      });
      setNewComment('');
      getComments(id);
    } catch (error) {
      console.error(error);
      alert('Failed to add comment');
    }
  };

  // Start editing a comment
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.commentText);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Save edited comment
  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await axios.put(`${API}/leads/${id}/comments/${commentId}`, {
        commentText: editText,
      });
      setEditingId(null);
      setEditText('');
      getComments(id);
    } catch (error) {
      console.error(error);
      alert('Failed to update comment');
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    const confirm = window.confirm('Delete this comment?');
    if (!confirm) return;

    try {
      await axios.delete(`${API}/leads/${id}/comments/${commentId}`);
      getComments(id);
    } catch (error) {
      console.error(error);
      alert('Failed to delete comment');
    }
  };

  // Show loading spinner
  

  // Show error if lead not found
  if (!lead) {
    return (
      <>

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

  // Main page
  return (
    <>


      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
          <h4 className="mb-4">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link
              className="btn text-white text-start border-0"
              to={`/`}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4">Lead Management: {lead.name}</h2>

            {/* Lead Details */}

            {loading &&
              <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            }
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
                      className={`badge ${lead.priority === 'High'
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
                <button className="btn btn-warning w-100 mt-3">
                  Edit Lead Details
                </button>
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
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-bottom pb-3 mb-3">
                        {editingId === comment.id ? (
                          // Editing mode
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
                                onClick={() => saveEdit(comment.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <strong>{comment.author}</strong>
                              <div className="d-flex gap-2 align-items-center">
                                <small className="text-muted">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </small>
                                <button
                                  className="btn btn-sm btn-outline-primary border-0"
                                  onClick={() => startEdit(comment)}
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

              {/* Add new comment */}
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