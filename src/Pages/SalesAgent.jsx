import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:3000";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API}/agents`);
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching agents");
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
            to={`/`}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-fill bg-light overflow-auto">
        <div className="container-fluid p-4">
          <h3 className="mb-4 border-bottom pb-2">
            Sales Agent Management
          </h3>

          {/* Agent List */}

          { loading &&
            
            <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}
          <div className="bg-white p-3 rounded shadow-sm">
            {agents.length === 0 ? (
              <p className="text-muted text-center mb-0">
                No agents found.
              </p>
            ) : (
              agents.map((agent, index) => (
                <div
                  key={index}
                  className="border-bottom py-2 d-flex justify-content-between"
                >
                  <span>
                    Agent: <strong>{agent.name}</strong> – {agent.email || "No email"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Add Agent Button */}
          <div className="text-center mt-4">
            <Link to={"/addagent"}
              className="btn btn-success"
              
            >
              + Add New Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
