import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useMainUrl } from "./useMainUrl";

const { mainUrl } = useMainUrl();
const API = mainUrl;

export default function LeadPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API}/leads`);
      setLeads(res.data);
      console.log(res);
    } catch (err) {
      console.error(err);
      alert("Error fetching leads");
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/leads/${id}`);
      if (res.status === 200) {
         toast.success("Lead deleted successfully");
        setLeads(leads.filter((lead) => lead.id !== id)); 
      } else {
         toast.error("Failed to delete lead");
      }
    } catch (err) {
      console.error(err);
       toast.error("Error deleting lead");
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
            <Link className="btn text-white text-start border-0" to="/">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill bg-light overflow-auto">
          <div className="container-fluid p-4">
            <h3 className="mb-4 border-bottom pb-2 text-center text-md-start">
              Lead Management - All Leads
            </h3>

            {loading ? (
              <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-3 rounded shadow-sm">
                {leads.length === 0 ? (
                  <p className="text-muted text-center mb-0">No leads found.</p>
                ) : (
                  leads.map((lead) => (
                    <div
                      key={lead.id} //
                      className="border-bottom py-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center text-center text-sm-start"
                    >
                      <div className="mb-2 mb-sm-0">
                        <div>
                          <strong>{lead.name}</strong>
                          <span
                            className={`badge ms-2 ${
                              lead.priority === "High"
                                ? "bg-danger"
                                : lead.priority === "Medium"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>
                        <small className="text-muted">
                          Status:{" "}
                          <span className="badge bg-secondary">
                            {lead.status}
                          </span>{" "}
                          | Agent: {lead.salesAgent?.name || "Unassigned"} |
                          Source: {lead.source} | Days: {lead.timeToClose}
                        </small>
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="mt-1">
                            {lead.tags.map((tag, i) => (
                              <span key={i} className="badge bg-info me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteLead(lead.id, lead.name)} // ✅ fixed
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

        
            <div className="text-center mt-4">
              <Link className="btn btn-success w-100 w-sm-auto" to="/add">
                + Add New Lead
              </Link>
            </div>
          </div>
        </div>
      </div>

     
      <style>{`
  @media (max-width: 550px) {
    /* Sidebar becomes full width at top */
    .bg-dark {
      width: 100% !important;
      min-height: auto !important;
      text-align: center !important;
      padding: 1rem !important;
    }

    /* Main container padding adjustment */
    .container-fluid {
      padding: 1rem !important;
    }

    /* Heading smaller and centered */
    h3 {
      font-size: 1.2rem !important;
      text-align: center !important;
    }

    /* Buttons smaller and full width */
    .btn {
      font-size: 0.9rem !important;
      width: 100% !important;
      margin-top: 0.5rem !important;
    }

    /* Lead card spacing and layout */
    .bg-white {
      margin-top: 1rem !important;
      padding: 1rem !important;
    }

    /* Stack name, status, and delete vertically */
    .border-bottom.py-3.d-flex {
      flex-direction: column !important;
      align-items: stretch !important;
      text-align: center !important;
    }

    /* Delete button spacing */
    .border-bottom .btn-danger {
      margin-top: 0.5rem !important;
      width: 100% !important;
    }

    /* Badges and tags spacing */
    .badge {
      margin: 2px !important;
    }

    body {
      overflow-x: hidden !important;
    }
  }
`}</style>

    </>
  );
}
