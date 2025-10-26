import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
const API = "http://localhost:3000";

export default function AddAgent() {
  const [form, setForm] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/agents`, form);
      if (res.status === 201 || res.status === 200) {
        alert("Agent created successfully!");
        setForm({ name: "", email: "" });
      } else {
        alert("Failed to create agent");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="mb-4">Anvaya CRM</h4>
        <div className="d-flex flex-column gap-2">
          <Link
            className="btn text-white text-start border-0"
            to={"/agent"}
          >
            ← Back to Agents
          </Link>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-fill bg-light overflow-auto">
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0">Add New Sales Agent</h4>
                </div>

                <div className="card-body">
                  <form onSubmit={submit}>
                    <div className="mb-3">
                      <label className="form-label">Agent Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter agent name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address:</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email address"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Agent"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
