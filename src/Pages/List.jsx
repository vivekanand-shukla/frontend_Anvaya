import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000';

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAgent, setFilterAgent] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const leadsResponse = await axios.get(`${API}/leads`);
      const agentsResponse = await axios.get(`${API}/agents`);
      setLeads(leadsResponse.data);
      setAgents(agentsResponse.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getFilteredLeads = () => {
    let filteredLeads = [...leads];

    if (filterStatus) {
      filteredLeads = filteredLeads.filter(lead => lead.status === filterStatus);
    }

    if (filterAgent) {
      filteredLeads = filteredLeads.filter(lead => lead.salesAgent?.id === filterAgent);
    }

    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      filteredLeads.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    if (sortBy === 'time') {
      filteredLeads.sort((a, b) => a.timeToClose - b.timeToClose);
    }

    return filteredLeads;
  };

  const filteredLeads = getFilteredLeads();


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
            <h2 className="mb-4">Lead List</h2>
          {loading && <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Lead Overview</h5>
              </div>
              <div className="card-body">
                {/* Top 3 Leads */}
                <div className="mb-4">
                  {filteredLeads.slice(0, 3).map((lead, index) => (
                    <div key={index} className="border-bottom pb-2 mb-2">
                      <strong>{lead.name}</strong> -
                      <span className="badge bg-secondary ms-2 me-2">{lead.status}</span> -
                      <span className="text-muted">{lead.salesAgent?.name || 'Unassigned'}</span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Filters */}
                <h6 className="mb-3">Filters:</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Sales Agent</label>
                    <select
                      className="form-select"
                      value={filterAgent}
                      onChange={(e) => setFilterAgent(e.target.value)}
                    >
                      <option value="">All Agents</option>
                      {agents.map((agent, index) => (
                        <option key={index} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort by */}
                <h6 className="mb-3">Sort by:</h6>
                <div className="btn-group mb-4" role="group">
                  <button
                    className={`btn ${sortBy === 'priority' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSortBy('priority')}
                  >
                    Priority
                  </button>
                  <button
                    className={`btn ${sortBy === 'time' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSortBy('time')}
                  >
                    Time to Close
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => setSortBy('')}>
                    Clear Sort
                  </button>
                </div>

                {/* Add New Lead Button */}
                <Link className="btn btn-success w-100" to={`/add`}>
                  + Add New Lead
                </Link>
              </div>
            </div>

            {/* All Leads List */}
            <div className="card">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">All Leads ({filteredLeads.length})</h5>
              </div>
              <div className="card-body">
                {filteredLeads.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <h5>No leads found</h5>
                    <p>Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="list-group">
                    {filteredLeads.map((lead, index) => (
                      <div
                        key={index}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: 'pointer' }}
                        onClick={() => (window.location.href = `/lead/${lead.id}`)}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{lead.name}</h5>
                          <small>
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
                          </small>
                        </div>
                        <p className="mb-1">
                          <span className="badge bg-secondary me-2">{lead.status}</span>
                          <small className="text-muted">
                            Agent: {lead.salesAgent?.name || 'Unassigned'} | Source: {lead.source} |
                            Days: {lead.timeToClose}
                          </small>
                        </p>
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="mt-2">
                            {lead.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="badge bg-info me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
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
