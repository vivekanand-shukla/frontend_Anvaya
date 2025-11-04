import { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Link } from 'react-router-dom';
import {useMainUrl} from  "./useMainUrl"
const { mainUrl } = useMainUrl()
const API = mainUrl;
import { toast } from "react-toastify";
export default function App() {
  const [d, setD] = useState([]);
  const [a, setA] = useState([]);
  const [l, setL] = useState(true);

  useEffect(() => {
    g();
  }, []);

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

  const closedLeads = d.filter(x => x.status === 'Closed').length;
  const pipelineLeads = d.filter(x => x.status !== 'Closed').length;

  const pipelineData = {
    labels: ['Closed', 'In Pipeline'],
    datasets: [
      {
        data: [closedLeads, pipelineLeads],
        backgroundColor: ['#10b981', '#3b82f6']
      }
    ]
  };

  const agentClosedData = {
    labels: a.map(x => x.name),
    datasets: [
      {
        label: 'Leads Closed',
        data: a.map(
          x => d.filter(lead => lead.salesAgent?.id === x.id && lead.status === 'Closed').length
        ),
        backgroundColor: '#10b981'
      }
    ]
  };

  const statusData = {
    labels: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'],
    datasets: [
      {
        data: [
          d.filter(x => x.status === 'New').length,
          d.filter(x => x.status === 'Contacted').length,
          d.filter(x => x.status === 'Qualified').length,
          d.filter(x => x.status === 'Proposal Sent').length,
          d.filter(x => x.status === 'Closed').length
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#6366f1', '#ef4444']
      }
    ]
  };

  return (
    <>
      <div className="d-flex vh-100">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
          <h4 className="mb-4">Anvaya CRM</h4>
          <div className="d-flex flex-column gap-2">
            <Link className="btn text-white text-start border-0" to={`/`}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill overflow-auto bg-light">
          <div className="container-fluid p-4">
            <h2 className="mb-4">Anvaya CRM Reports</h2>

            {l && (
              <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Total Leads Closed and in Pipeline</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <Pie data={pipelineData} />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className="mb-1">
                    <strong>Closed:</strong> {closedLeads} leads
                  </p>
                  <p className="mb-0">
                    <strong>In Pipeline:</strong> {pipelineLeads} leads
                  </p>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Leads Closed by Sales Agent</h5>
              </div>
              <div className="card-body">
                <Bar data={agentClosedData} />
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Lead Status Distribution</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <Pie data={statusData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Summary</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="text-primary">{d.length}</h3>
                    <p className="text-muted">Total Leads</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="text-success">{closedLeads}</h3>
                    <p className="text-muted">Closed Leads</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="text-info">{pipelineLeads}</h3>
                    <p className="text-muted">In Pipeline</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h3 className="text-warning">{a.length}</h3>
                    <p className="text-muted">Sales Agents</p>
                  </div>
                </div>
              </div>
            </div>
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

            .row.text-center > div {
              flex: 1 1 45%;
              max-width: 45%;
              margin: 5px auto;
            }

            .card-body canvas {
              width: 100% !important;
              height: auto !important;
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
