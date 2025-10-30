import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const API = 'http://localhost:3000';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseLeads = await axios.get(`${API}/leads`);
      const responseAgents = await axios.get(`${API}/agents`);
      const leadsData = responseLeads.data;
      const agentsData = responseAgents.data;

      setLeads(leadsData);
      setAgents(agentsData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const countByStatus = (statusValue) =>
    leads.filter((item) => item.status === statusValue).length;

  const filteredLeads = filter
    ? leads.filter((item) => item.status === filter)
    : leads;

    console.log(filteredLeads)
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 bg-dark text-white min-vh-100 p-0">
            <div className="p-4">
              <h4 className="mb-4">Anvaya CRM</h4>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white bg-primary rounded" to="/">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/lead">
                    Leads
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to={`/list`} >
                  Lead  List
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/agent">
                   Sales Agent 
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/status">
                    Status View
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/agentview">
                    Agent View
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/report">
                    Report
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
    

          <div className="col-md-10 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Anvaya CRM Dashboard</h2>
              <Link className="btn btn-success" to={`/add`}>+ Add New Lead</Link>
            </div>


   {loading &&  <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}


            {/* Lead Status */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Lead Status:</h5>
                <div className="row g-3">
                  <div className="col-md-2">
                    <div className="border-start border-primary border-4 ps-3 py-2 bg-light">
                      <div className="text-muted small">New</div>
                      <h3 className="mb-0">{countByStatus('New')}</h3>
                      <small className="text-muted">Leads</small>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="border-start border-warning border-4 ps-3 py-2 bg-light">
                      <div className="text-muted small">Contacted</div>
                      <h3 className="mb-0">{countByStatus('Contacted')}</h3>
                      <small className="text-muted">Leads</small>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="border-start border-success border-4 ps-3 py-2 bg-light">
                      <div className="text-muted small">Qualified</div>
                      <h3 className="mb-0">{countByStatus('Qualified')}</h3>
                      <small className="text-muted">Leads</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-start border-info border-4 ps-3 py-2 bg-light">
                      <div className="text-muted small">Proposal Sent</div>
                      <h3 className="mb-0">{countByStatus('Proposal Sent')}</h3>
                      <small className="text-muted">Leads</small>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="border-start border-danger border-4 ps-3 py-2 bg-light">
                      <div className="text-muted small">Closed</div>
                      <h3 className="mb-0">{countByStatus('Closed')}</h3>
                      <small className="text-muted">Leads</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Quick Filters:</h5>
                <div className="btn-group" role="group">
                  {['', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`btn ${
                          filter === status ? 'btn-primary' : 'btn-outline-primary'
                        }`}
                      >
                        {status === '' ? 'All' : status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Leads List */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  {filter
                    ? `${filter} Leads (${filteredLeads.length})`
                    : `All Leads (${filteredLeads.length})`}
                </h5>

                {filteredLeads.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <h4>No leads found</h4>
                  
                  </div>
                ) : (
                  <div className="row g-3">
                    {filteredLeads.map((lead, index) => (
                      
                      <Link key={index} className="col-md-6" style={{ cursor:'pointer'  ,textDecoration: 'none' }} to={`/lead/${lead.id}`}       >
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
                              <h6 className="card-title mb-0">{lead.name} </h6>
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
                              <div>
                                👤{' '}
                                {lead.salesAgent
                                  ? lead.salesAgent.name
                                  : 'Unassigned'}
                              </div>
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
