import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {useMainUrl} from  "./useMainUrl"
const { mainUrl } = useMainUrl()
const API = mainUrl;

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
    <>
      <div className="d-flex flex-column flex-md-row vh-100">
        {/* Sidebar */}
        <div
          className="bg-dark text-white p-3 flex-shrink-0"
          style={{ width: "250px", minHeight: "100vh" }}
        >
          <h4 className="mb-4 text-center text-md-start">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link className="btn text-white text-start border-0" to={`/`}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill bg-light overflow-auto">
          <div className="container-fluid p-4">
            <h3 className="mb-4 border-bottom pb-2 text-center text-md-start">
              Sales Agent Management
            </h3>

            {/* Loading Spinner */}
            {loading && (
              <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Agent List */}
            <div className="bg-white p-3 rounded shadow-sm">
              {agents.length === 0 ? (
                <p className="text-muted text-center mb-0">No agents found.</p>
              ) : (
                agents.map((agent, index) => (
                  <div
                    key={index}
                    className="border-bottom py-2 d-flex flex-column flex-sm-row justify-content-between text-center text-sm-start"
                  >
                    <span>
                      Agent: <strong>{agent.name}</strong> –{" "}
                      {agent.email || "No email"}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add Agent Button */}
            <div className="text-center mt-4">
              <Link to={"/addagent"} className="btn btn-success w-100 w-sm-auto">
                + Add New Agent
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 550px) {
          .bg-dark {
            width: 100% !important;
            min-height: auto !important;
            text-align: center !important;
            padding: 1rem !important;
          }

          h4 {
            font-size: 1.2rem !important;
          }

          .container-fluid {
            padding: 1rem !important;
          }

          .card,
          .bg-white {
            margin-top: 1rem !important;
            padding: 1rem !important;
          }

          .btn {
            font-size: 0.9rem !important;
          }

          h3 {
            font-size: 1.3rem !important;
            text-align: center !important;
          }
        }
      `}</style>
    </>
  );
}
