import React, { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

export default function App() {
  const [d, setD] = useState([]);
  const [a, setA] = useState([]);
  const [c, setC] = useState([]);
  const [l, setL] = useState(true);
  const [f, setF] = useState('');
  const [v, setV] = useState('dashboard');
  const [sel, setSel] = useState(null);
  const [txt, setTxt] = useState('');
  const [fa, setFa] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    g();
  }, []);

  useEffect(() => {
    if (sel) {
      gc();
    }
  }, [sel]);

  const g = async () => {
    try {
      const r1 = await fetch(`${API}/leads`);
      const r2 = await fetch(`${API}/agents`);
      const d1 = await r1.json();
      const d2 = await r2.json();
      setD(d1);
      setA(d2);
      setL(false);
    } catch (e) {
      console.log(e);
      setL(false);
    }
  };

  const gc = async () => {
    try {
      const r = await fetch(`${API}/leads/${sel._id}/comments`);
      const data = await r.json();
      setC(data);
    } catch (e) {
      console.log(e);
    }
  };

  const ac = async () => {
    if (!txt.trim()) return;
    try {
      await fetch(`${API}/leads/${sel._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText: txt, author: sel.salesAgent?.id })
      });
      setTxt('');
      gc();
    } catch (e) {
      console.log(e);
    }
  };

  const s = (v) => d.filter(i => i.status === v).length;
  const fd = f ? d.filter(i => i.status === f) : d;

  const getFiltered = () => {
    let res = f ? d.filter(i => i.status === f) : d;
    if (fa) {
      res = res.filter(i => i.salesAgent?.id === fa);
    }
    if (sort === 'priority') {
      const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
      res = [...res].sort((a, b) => p[b.priority] - p[a.priority]);
    }
    if (sort === 'time') {
      res = [...res].sort((a, b) => a.timeToClose - b.timeToClose);
    }
    return res;
  };

  const ld = v === 'leads' ? getFiltered() : fd;

  if (l) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{width: '250px', minHeight: '100vh'}}>
          <h4 className="mb-4">Anvaya CRM</h4>
          
          <div className="d-flex flex-column gap-2">
            {sel ? (
              <button 
                className="btn text-white text-start border-0"
                onClick={() => {setSel(null); setV('dashboard');}}
              >
                ← Back to Dashboard
              </button>
            ) : (
              <>
                <button 
                  className={`btn text-start border-0 ${v === 'dashboard' ? 'btn-primary' : 'text-white'}`}
                  onClick={() => setV('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className={`btn text-start border-0 ${v === 'leads' ? 'btn-primary' : 'text-white'}`}
                  onClick={() => setV('leads')}
                >
                  Leads
                </button>
                <button 
                  className={`btn text-start border-0 ${v === 'agents' ? 'btn-primary' : 'text-white'}`}
                  onClick={() => setV('agents')}
                >
                  Sales Agents
                </button>
                <button 
                  className={`btn text-start border-0 ${v === 'reports' ? 'btn-primary' : 'text-white'}`}
                  onClick={() => setV('reports')}
                >
                  Reports
                </button>
                <button 
                  className={`btn text-start border-0 ${v === 'settings' ? 'btn-primary' : 'text-white'}`}
                  onClick={() => setV('settings')}
                >
                  Settings
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          {sel ? (
            // Lead Management Screen
            <div className="container-fluid p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lead Management: {sel.name}</h2>
                <button className="btn btn-warning">Edit Lead Details</button>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">Lead Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Lead Name:</strong>
                        <p className="mb-0">{sel.name}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Sales Agent:</strong>
                        <p className="mb-0">{sel.salesAgent?.name || 'Unassigned'}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Lead Source:</strong>
                        <p className="mb-0">{sel.source}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Lead Status:</strong>
                        <p className="mb-0">
                          <span className="badge bg-secondary">{sel.status}</span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong>Priority:</strong>
                        <p className="mb-0">
                          <span className={`badge ${
                            sel.priority === 'High' ? 'bg-danger' : 
                            sel.priority === 'Medium' ? 'bg-warning' : 
                            'bg-success'
                          }`}>
                            {sel.priority}
                          </span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong>Time to Close:</strong>
                        <p className="mb-0">{sel.timeToClose} Days</p>
                      </div>
                      {sel.tags && sel.tags.length > 0 && (
                        <div className="mb-3">
                          <strong>Tags:</strong>
                          <div className="mt-2">
                            {sel.tags.map((t, i) => (
                              <span key={i} className="badge bg-info me-1">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">Comments Section</h5>
                    </div>
                    <div className="card-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {c.length === 0 ? (
                        <p className="text-muted text-center">No comments yet</p>
                      ) : (
                        <div className="mb-3">
                          {c.map((cm, i) => (
                            <div key={i} className="border-bottom pb-3 mb-3">
                              <div className="d-flex justify-content-between">
                                <strong>{cm.author}</strong>
                                <small className="text-muted">
                                  {new Date(cm.createdAt).toLocaleString()}
                                </small>
                              </div>
                              <p className="mb-0 mt-2">{cm.commentText}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Add new comment..."
                          value={txt}
                          onChange={(e) => setTxt(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && ac()}
                        />
                        <button 
                          className="btn btn-success" 
                          onClick={ac}
                        >
                          Submit Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : v === 'leads' ? (
            // Lead List Screen
            <div className="container-fluid p-4">
              <h2 className="mb-4">Lead List</h2>

              <div className="card mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">Lead Overview</h5>
                </div>
                <div className="card-body">
                  <div className="list-group mb-3">
                    {ld.slice(0, 3).map((x, i) => (
                      <div key={i} className="list-group-item">
                        <strong>{x.name}</strong> - 
                        <span className="badge bg-secondary ms-2 me-2">{x.status}</span> - 
                        <span className="text-muted">{x.salesAgent?.name || 'Unassigned'}</span>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <h6 className="mb-3">Filters:</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        value={f}
                        onChange={(e) => setF(e.target.value)}
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
                        value={fa}
                        onChange={(e) => setFa(e.target.value)}
                      >
                        <option value="">All Agents</option>
                        {a.map((ag, i) => (
                          <option key={i} value={ag.id}>{ag.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <h6 className="mb-3">Sort by:</h6>
                  <div className="btn-group mb-3" role="group">
                    <button 
                      className={`btn ${sort === 'priority' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSort('priority')}
                    >
                      Priority
                    </button>
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

                  {/* <button className="btn btn-success w-100">+ Add New Lead</button> */}
                </div>
              </div>

              {/* Full Leads List */}
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">All Leads ({ld.length})</h5>
                </div>
                <div className="card-body">
                  {ld.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <h5>No leads found</h5>
                      <p>Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="list-group">
                      {fd.map((x, i) => (
                        <div 
                          key={i} 
                          className="list-group-item list-group-item-action"
                          onClick={() => setSel(x)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{x.name}</h5>
                            <small>
                              <span className={`badge ${
                                x.priority === 'High' ? 'bg-danger' : 
                                x.priority === 'Medium' ? 'bg-warning' : 
                                'bg-success'
                              }`}>
                                {x.priority}
                              </span>
                            </small>
                          </div>
                          <p className="mb-1">
                            <span className="badge bg-secondary me-2">{x.status}</span>
                            <small className="text-muted">
                              Agent: {x.salesAgent?.name || 'Unassigned'} | 
                              Source: {x.source} | 
                              Days: {x.timeToClose}
                            </small>
                          </p>
                          {x.tags && x.tags.length > 0 && (
                            <div className="mt-2">
                              {x.tags.map((t, j) => (
                                <span key={j} className="badge bg-info me-1">{t}</span>
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
          ) : (
            // Dashboard Screen
            <div className="container-fluid p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Anvaya CRM Dashboard</h2>
                {/* <button className="btn btn-success">+ Add New Lead</button> */}
              </div>

              {/* Lead Status Section */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Lead Status:</h5>
                  <div className="row g-3">
                    <div className="col">
                      <div className="border-start border-primary border-4 p-3 bg-light">
                        <h6 className="text-muted mb-1">New</h6>
                        <h3 className="mb-0">{s('New')}</h3>
                        <small className="text-muted">Leads</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border-start border-warning border-4 p-3 bg-light">
                        <h6 className="text-muted mb-1">Contacted</h6>
                        <h3 className="mb-0">{s('Contacted')}</h3>
                        <small className="text-muted">Leads</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border-start border-success border-4 p-3 bg-light">
                        <h6 className="text-muted mb-1">Qualified</h6>
                        <h3 className="mb-0">{s('Qualified')}</h3>
                        <small className="text-muted">Leads</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border-start border-info border-4 p-3 bg-light">
                        <h6 className="text-muted mb-1">Proposal Sent</h6>
                        <h3 className="mb-0">{s('Proposal Sent')}</h3>
                        <small className="text-muted">Leads</small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="border-start border-danger border-4 p-3 bg-light">
                        <h6 className="text-muted mb-1">Closed</h6>
                        <h3 className="mb-0">{s('Closed')}</h3>
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
                    <button 
                      className={`btn btn-primary ${f === '' ? '' : 'opacity-75'}`}
                      onClick={() => setF('')}
                    >
                      All
                    </button>
                    <button 
                      className={`btn btn-primary ${f === 'New' ? '' : 'opacity-75'}`}
                      onClick={() => setF('New')}
                    >
                      New
                    </button>
                    <button 
                      className={`btn btn-primary ${f === 'Contacted' ? '' : 'opacity-75'}`}
                      onClick={() => setF('Contacted')}
                    >
                      Contacted
                    </button>
                    <button 
                      className={`btn btn-primary ${f === 'Qualified' ? '' : 'opacity-75'}`}
                      onClick={() => setF('Qualified')}
                    >
                      Qualified
                    </button>
                    <button 
                      className={`btn btn-primary ${f === 'Proposal Sent' ? '' : 'opacity-75'}`}
                      onClick={() => setF('Proposal Sent')}
                    >
                      Proposal Sent
                    </button>
                    <button 
                      className={`btn btn-primary ${f === 'Closed' ? '' : 'opacity-75'}`}
                      onClick={() => setF('Closed')}
                    >
                      Closed
                    </button>
                  </div>
                </div>
              </div>

              {/* All Leads List */}
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    {f ? `${f} Leads (${fd.length})` : `All Leads (${fd.length})`}
                  </h5>
                </div>
                <div className="card-body">
                  {fd.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <h5>No leads found</h5>
                      <p>Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="list-group">
                      {fd.map((x, i) => (
                        <div 
                          key={i} 
                          className="list-group-item list-group-item-action"
                          onClick={() => setSel(x)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{x.name}</h5>
                            <small>
                              <span className={`badge ${
                                x.priority === 'High' ? 'bg-danger' : 
                                x.priority === 'Medium' ? 'bg-warning' : 
                                'bg-success'
                              }`}>
                                {x.priority}
                              </span>
                            </small>
                          </div>
                          <p className="mb-1">
                            <span className="badge bg-secondary me-2">{x.status}</span>
                            <small className="text-muted">
                              Agent: {x.salesAgent?.name || 'Unassigned'} | 
                              Source: {x.source} | 
                              Days: {x.timeToClose}
                            </small>
                          </p>
                          {x.tags && x.tags.length > 0 && (
                            <div className="mt-2">
                              {x.tags.map((t, j) => (
                                <span key={j} className="badge bg-info me-1">{t}</span>
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
          )}
        </div>
      </div>
    </>
  );
}