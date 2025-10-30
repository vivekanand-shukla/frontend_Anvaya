import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import {useMainUrl} from  "./useMainUrl"
const { mainUrl } = useMainUrl()
const API = mainUrl;

export default function AddLead() {
  const [a, setA] = useState([]);
  const [l, setL] = useState(true);
  const [form, setForm] = useState({
    name: '',
    source: 'Website',
    salesAgent: '',
    status: 'New',
    priority: 'Medium',
    timeToClose: 30,
    tags: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get(`${API}/agents`);
      setA(data);
      if (data.length > 0) {
        setForm(prev => ({ ...prev, salesAgent: data[0].id }));
      }
      setL(false);
    } catch (e) {
      console.log(e);
      setL(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const tagsArray = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const response = await axios.post(`${API}/leads`, {
        name: form.name,
        source: form.source,
        salesAgent: form.salesAgent,
        status: form.status,
        priority: form.priority,
        timeToClose: parseInt(form.timeToClose),
        tags: tagsArray
      });

      if (response.status === 200 || response.status === 201) {
        alert('Lead created successfully!');
      } else {
        alert('Error: Failed to create lead');
      }
    } catch (e) {
      console.log(e);
      alert('Error creating lead');
    }
  };

  return (
    <div className="container-fluid vh-100 overflow-auto">
      <div className="row flex-column flex-md-row h-100">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 bg-dark text-white p-4">
          <h4 className="mb-4 text-center text-md-start">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link className="btn text-white text-start border-0" to={"/"}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col bg-light overflow-auto p-3 p-md-4">
          {l ? (
            <div className="d-flex align-items-center justify-content-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white text-center text-md-start">
                      <h4 className="mb-0">Add New Lead</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={submit}>
                        <div className="mb-3">
                          <label className="form-label">Lead Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter lead name"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Lead Source:</label>
                          <select
                            className="form-select"
                            value={form.source}
                            onChange={(e) => setForm({ ...form, source: e.target.value })}
                          >
                            <option value="Website">Website</option>
                            <option value="Referral">Referral</option>
                            <option value="Cold Call">Cold Call</option>
                            <option value="Advertisement">Advertisement</option>
                            <option value="Email">Email</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Sales Agent:</label>
                          <select
                            className="form-select"
                            value={form.salesAgent}
                            onChange={(e) => setForm({ ...form, salesAgent: e.target.value })}
                            required
                          >
                            <option value="">Select Agent</option>
                            {a.map((agent, i) => (
                              <option key={i} value={agent.id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Lead Status:</label>
                          <select
                            className="form-select"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Priority:</label>
                          <select
                            className="form-select"
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Time to Close (Days):</label>
                          <input
                            type="number"
                            className="form-control"
                            value={form.timeToClose}
                            onChange={(e) => setForm({ ...form, timeToClose: e.target.value })}
                            min="1"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Tags:</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            placeholder="Enter tags separated by commas (e.g., High Value, Follow-up)"
                          />
                          <small className="form-text text-muted">
                            Separate multiple tags with commas
                          </small>
                        </div>

                        <button type="submit" className="btn btn-success w-100">
                          Create Lead
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
