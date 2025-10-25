import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter , RouterProvider} from 'react-router-dom'
import List from './Pages/List'
import Lead from "./Pages/Lead.jsx"
import LeadAll from "./Pages/AllLead.jsx"
const routes = createBrowserRouter([
  {path: "/" , element:<App/> } ,
  {path: "/lead/:id" , element:<Lead/> } ,
  {path: "/lead" , element:<LeadAll/> } ,
   {path: "/list" , element:<List/> } ,

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
