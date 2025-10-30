import { useState, useEffect } from 'react';
import axios from 'axios';
import {useMainUrl} from  "./useMainUrl"
const { mainUrl } = useMainUrl()
const API = mainUrl;
import { Link } from 'react-router-dom';

export default function StatusView() {
  const [d, setD] = useState([]);
  const [a, setA] = useState([]);
  const [l, setL] = useState(true);
  const [fa, setFa] = useState('');
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

  const getByStatus = (status) => {
    let res = d.filter(i => i.status === status);
    if (fa) res = res.filter(i => i.salesAgent?.id === fa);
    if (fp) res = res.filter(i => i.priority === fp);
    if (sort === 'time') res = [...res].sort((a, b) => a.timeToClose - b.timeToClose);
    return res;
  };

  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];

  return (
    <>
      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
          <h4 className="mb-4">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link to={`/`} className="btn text-white text-start border-0">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4">Leads by Status</h2>

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
                  <div className="col-md-6">
                    <label className="form-label">Sales Agent</label>
                    <select
                      className="form-select"
                      value={fa}
                      onChange={(e) => setFa(e.target.value)}
                    >
                      <option value="">All Agents</option>
                      {a.map((ag, i) => (
                        <option key={i} value={ag.id}>
                          {ag.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
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
                <div className="btn-group" role="group">
                  <button
                    className={`btn ${sort === 'time' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSort('time')}
                  >
                    Time to Close
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => setSort('')}>
                    Clear Sort
                  </button>
                </div>
              </div>
            </div>

            {/* Status Groups */}
            {statuses.map((status, idx) => {
              const leads = getByStatus(status);
              return (
                <div key={idx} className="card mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      Status: {status} ({leads.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    {leads.length === 0 ? (
                      <p className="text-muted text-center py-3">No leads in this status</p>
                    ) : (
                      <div className="list-group">
                        {leads.map((x, i) => (
                          <div
                            key={i}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => (window.location.href = `/lead/${x.id}`)}
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <div>
                                <strong>{x.name}</strong> -
                                <span className="text-muted ms-2">
                                  Sales Agent: {x.salesAgent?.name || 'Unassigned'}
                                </span>
                              </div>
                              <div>
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
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 550px) {
            .d-flex.vh-100 {
              flex-direction: column;
              height: auto !important;
            }

            .bg-dark.text-white.p-3 {
              width: 100% !important;
              text-align: center;
              min-height: auto !important;
            }

            .flex-fill.overflow-auto.bg-light {
              width: 100% !important;
              padding: 0 !important;
            }

            .container-fluid.p-4 {
              padding: 1rem !important;
            }

            .card.mb-4 {
              margin-bottom: 1rem !important;
            }

            h2.mb-4 {
              font-size: 1.3rem !important;
              text-align: center;
            }

            .btn-group {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }

            .btn-group .btn {
              flex: 1 1 45%;
              margin: 3px;
            }

            .list-group-item {
              font-size: 0.9rem !important;
              padding: 10px !important;
            }

            .card-header h5 {
              font-size: 1rem !important;
              text-align: center;
            }

            .card-body {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </>
  );
}
