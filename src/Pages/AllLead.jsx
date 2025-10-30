import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

export default function AllLead() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API}/leads`);
      setLeads(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };



  return (
    <>


      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '370px', minHeight: '100vh' }}>
          <h4 className="mb-4">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link className="btn text-white text-start border-0" to="/"> ← Back to Dashboard</Link>
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4">All Leads</h2>

            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Leads ({leads.length})</h5>
              </div>
               {loading &&  <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}
              <div className="card-body">
                {leads.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <h5>No leads found</h5>
                  </div>
                ) : (
                  <div className="row g-3">
                    {leads.map((lead, index) => (
                      <div key={index} className="col-md-6">
                        <Link
                          to={`/lead/${lead.id}`}
                          className="text-decoration-none"
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className={`card h-100 border-start border-5 ${
                              lead.priority === 'High'
                                ? 'border-danger'
                                : lead.priority === 'Medium'
                                ? 'border-warning'
                                : 'border-success'
                            }`}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title mb-0 text-dark">{lead.name}</h6>
                                <span
                                  className={`badge ${
                                    lead.priority === 'High'
                                      ? 'bg-danger'
                                      : lead.priority === 'Medium'
                                      ? 'bg-warning text-dark'
                                      : 'bg-success'
                                  }`}
                                >
                                  {lead.priority}
                                </span>
                              </div>
                              <div className="small text-muted mb-2">
                                <div>👤 {lead.salesAgent?.name || 'Unassigned'}</div>
                                <div>📊 Status: {lead.status}</div>
                                <div>⏱️ Time to Close: {lead.timeToClose} days</div>
                                <div>📍 Source: {lead.source}</div>
                              </div>
                              {lead.tags && lead.tags.length > 0 && (
                                <div className="mt-2">
                                  {lead.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="badge bg-info text-dark me-1"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
