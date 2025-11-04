import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import List from './Pages/List'
import Lead from "./Pages/Lead.jsx"
import LeadAll from "./Pages/AllLead"
import AddLead from "./Pages/AddLead"
import SalesAgent from "./Pages/SalesAgent"
import StatusLead from "./Pages/StatusView"
import AddAgent from './Pages/AddAgent'
import AgentView from './Pages/AgentView'
import Report from './Pages/Report'
import Setting from './Pages/setting.jsx'
import { ToastContainer  } from "react-toastify";
const routes = createBrowserRouter([
  {path: "/" , element:<App/> } ,
  {path: "/lead/:id" , element:<Lead/> } ,
  {path: "/lead" , element:<LeadAll/> } ,
   {path: "/list" , element:<List/> } ,
   {path: "/add" , element:<AddLead/> } ,
   {path: "/agent" , element:<SalesAgent/> } ,
   {path: "/status" , element:<StatusLead/> } ,
   {path: "/addagent" , element:<AddAgent/> } ,
   {path: "/agentview" , element:<AgentView/> } ,
   {path: "/report" , element:<Report/> } ,
   {path: "/setting" , element:<Setting/> } ,

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
    <ToastContainer />
  </StrictMode>,
)
