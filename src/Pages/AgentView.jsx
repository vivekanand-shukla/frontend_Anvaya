import { useState, useEffect } from 'react';
import axios from 'axios';
import {useMainUrl} from  "./useMainUrl"
import { toast } from "react-toastify";
const { mainUrl } = useMainUrl()
const API = mainUrl;
import { Link } from 'react-router-dom';

export default function AgentView() {
  const [d, setD] = useState([]);
  const [a, setA] = useState([]);
  const [l, setL] = useState(true);
  const [fs, setFs] = useState('');
  const [fp, setFp] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    g();
  }, []);

  const g = async () => {
    try {
      const r1 = await axios.get(`${API}/leads`);
      const r2 = await axios.get(`${API}/agents`);
      const d1 = r1.data;
      const d2 = r2.data;
      setD(d1);
      setA(d2);
      setL(false);
    } catch (e) {
      console.log(e);
      setL(false);
    }
  };

  const getByAgent = (agentId) => {
    let res = d.filter(i => i.salesAgent?.id === agentId);
    if (fs) res = res.filter(i => i.status === fs);
    if (fp) res = res.filter(i => i.priority === fp);
    if (sort === 'time') res = [...res].sort((a, b) => a.timeToClose - b.timeToClose);
    return res;
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3 flex-shrink-0" style={{ width: '250px', minHeight: '100vh' }}>
          <h4 className="mb-4 text-center text-md-start">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link className="btn text-white text-start border-0" to={`/`}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4 text-center text-md-start">Leads by Sales Agent</h2>

            {l && (
              <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Filters Section */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="mb-3">Filters:</h6>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={fs}
                      onChange={(e) => setFs(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={fp}
                      onChange={(e) => setFp(e.target.value)}
                    >
                      <option value="">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <h6 className="mb-3">Sort by:</h6>
                <div className="btn-group w-100 w-md-auto" role="group">
                  <button
                    className={`btn ${sort === 'time' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSort('time')}
                  >
                    Time to Close
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSort('')}
                  >
                    Clear Sort
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Groups */}
            {a.map((agent, idx) => {
              const leads = getByAgent(agent.id);
              return (
                <div key={idx} className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0 text-center text-md-start">
                      Sales Agent: {agent.name} ({leads.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    {leads.length === 0 ? (
                      <p className="text-muted text-center py-3">No leads assigned to this agent</p>
                    ) : (
                      <div className="list-group">
                        {leads.map((x, i) => (
                          <div
                            key={i}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => (window.location.href = `/lead/${x.id}`)}
                          >
                            <div className="d-flex flex-column flex-sm-row w-100 justify-content-between">
                              <div>
                                <strong>{x.name}</strong> -
                                <span className="text-muted ms-2">Status: {x.status}</span>
                              </div>
                              <div className="mt-2 mt-sm-0">
                                <span
                                  className={`badge ${
                                    x.priority === 'High'
                                      ? 'bg-danger'
                                      : x.priority === 'Medium'
                                      ? 'bg-warning'
                                      : 'bg-success'
                                  } me-2`}
                                >
                                  {x.priority}
                                </span>
                                <small className="text-muted">{x.timeToClose} days</small>
                              </div>
                            </div>

                            {x.tags && x.tags.length > 0 && (
                              <div className="mt-2">
                                {x.tags.map((t, j) => (
                                  <span key={j} className="badge bg-info me-1">
                                    {t}
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
              );
            })}

            {/* Unassigned Leads */}
            {(() => {
              const unassigned = d.filter((i) => !i.salesAgent);
              if (unassigned.length > 0) {
                return (
                  <div className="card mb-4">
                    <div className="card-header bg-warning text-dark">
                      <h5 className="mb-0 text-center text-md-start">
                        Unassigned Leads ({unassigned.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="list-group">
                        {unassigned.map((x, i) => (
                          <div
                            key={i}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => (window.location.href = `/lead/${x.id}`)}
                          >
                            <div className="d-flex flex-column flex-sm-row w-100 justify-content-between">
                              <div>
                                <strong>{x.name}</strong> -
                                <span className="text-muted ms-2">Status: {x.status}</span>
                              </div>
                              <div className="mt-2 mt-sm-0">
                                <span
                                  className={`badge ${
                                    x.priority === 'High'
                                      ? 'bg-danger'
                                      : x.priority === 'Medium'
                                      ? 'bg-warning'
                                      : 'bg-success'
                                  } me-2`}
                                >
                                  {x.priority}
                                </span>
                                <small className="text-muted">{x.timeToClose} days</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>

    
      <style>{`
        @media (max-width: 550px) {
          .bg-dark {
            width: 100% !important;
            min-height: auto !important;
            text-align: center;
          }

          .bg-light {
            padding: 1rem !important;
          }

          h2 {
            font-size: 1.3rem;
            text-align: center;
          }

          .card-body {
            padding: 0.8rem !important;
          }

          .btn-group button {
            width: 100%;
            margin-bottom: 5px;
          }

          .list-group-item {
            font-size: 0.9rem;
            padding: 0.8rem;
          }

          .badge {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
