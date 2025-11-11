# Anvaya CRM - Customer Relationship Management

A full-stack Customer Relationship Management app where you can add, edit, view, filter leads and sales agents.  
Built with a React frontend, Express/Node backend, MongoDB database.

---

## Demo Link

[Live Demo](https://frontend-anvaya-88cbjdslz-vivekanand-shuklas-projects.vercel.app/)  

---

## Quick Start

```bash
git clone https://github.com/vivekanand-shukla/frontend_Anvaya.git
cd <your-repo>
npm install
npm run dev      
```

## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB

## Demo Video
Watch a walkthrough (5–7 minutes) of all major features of this app:
[youtube Video Link](https://youtu.be/Zjuqdz5yCqY)

## Features

**Sidebar**
- Link to dashboard
- Link to lead
- Link to lead list
- Link to sales agent
- Status view
- Agent view
- Report
- Settings

**Home**
- Lead status show
- Quick filter 
- Lead details with clickable link
- Add new lead button
- Go to dashboard 

**Lead**
- All leads with clickable link to get details
- Go to dashboard 

**Lead List**
- Lead overview
- Filter by status and sales agent 
- Sort by price and time to close 
- Add new lead button
- Showing all leads
- Back to dashboard button

**Sales Agent**
- All sales agent list
- Add new agent button
- Back to dashboard button

**Status View**
- Filter by sales agent and priority
- Sort by time to close 
- All leads with their status view
- Back to dashboard

**Sales Agent View**
- Filter by status and priority
- Sort by time to close
- All leads with their sales agent view
- Back to dashboard

**Report**
- Total leads in pipeline and closed report
- Lead closed by sales agent report 
- Lead status distribution
- Summary 
- Back to dashboard

**Settings**
- All leads showing
- Lead delete button
- Add new lead button
- Back to dashboard

**Add Lead Form**
- All information input and create new lead button
- Back to dashboard

**Add Agent**
- Name and email input
- Create agent button
- Back to dashboard button

**Single Lead View**
- Lead detail view
- Edit lead detail feature
- Comment section with add, update, delete feature

## API Reference

### **POST /leads**
Create a new lead  
Sample Response:
```json
{ 
  "id": "...", 
  "name": "...", 
  "source": "...", 
  "salesAgent": {...}, 
  "status": "...", 
  "tags": [...], 
  "timeToClose": ..., 
  "priority": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### **GET /leads**
Get all leads with optional filtering (by salesAgent, status, tags, source)  
Sample Response:
```json
[
  { 
    "id": "...", 
    "name": "...", 
    "source": "...", 
    "salesAgent": {...}, 
    "status": "...", 
    "tags": [...], 
    "timeToClose": ..., 
    "priority": "...",
    "createdAt": "..."
  }
]
```

### **PUT /leads/:id**
Update a lead by ID  
Sample Response:
```json
{ 
  "id": "...", 
  "name": "...", 
  "source": "...", 
  "salesAgent": {...}, 
  "status": "...", 
  "tags": [...], 
  "timeToClose": ..., 
  "priority": "...",
  "updatedAt": "..."
}
```

### **DELETE /leads/:id**
Delete a lead by ID  
Sample Response:
```json
{ "message": "Lead deleted successfully." }
```

### **POST /agents**
Create a new sales agent  
Sample Response:
```json
{ 
  "message": "agent saved", 
  "savedagent": {...}
}
```

### **GET /agents**
Get all sales agents  
Sample Response:
```json
[
  { 
    "id": "...", 
    "name": "...", 
    "email": "..."
  }
]
```

### **POST /leads/:id/comments**
Add a comment to a lead  
Sample Response:
```json
{ 
  "id": "...", 
  "commentText": "...", 
  "author": "...", 
  "createdAt": "..."
}
```

### **GET /leads/:id/comments**
Get all comments for a lead  
Sample Response:
```json
[
  { 
    "id": "...", 
    "commentText": "...", 
    "author": "...", 
    "createdAt": "..."
  }
]
```

### **PUT /leads/:leadId/comments/:commentId**
Update a comment  
Sample Response:
```json
{ 
  "id": "...", 
  "commentText": "...", 
  "author": "...", 
  "createdAt": "...",
  "updatedAt": "..."
}
```

### **DELETE /leads/:leadId/comments/:commentId**
Delete a comment  
Sample Response:
```json
{ "message": "Comment deleted successfully." }
```

### **POST /tags**
Create a new tag  
Sample Response:
```json
{ 
  "id": "...", 
  "name": "...", 
  "createdAt": "..."
}
```

### **GET /tags**
Get all tags  
Sample Response:
```json
[
  { 
    "id": "...", 
    "name": "..."
  }
]
```

### **GET /report/last-week**
Get leads closed last week  
Sample Response:
```json
[
  { 
    "id": "...", 
    "name": "...", 
    "salesAgent": "...", 
    "closedAt": "..."
  }
]
```

### **GET /report/pipeline**
Get total leads in pipeline  
Sample Response:
```json
{ "totalLeadsInPipeline": ... }
```

## Contact
For bugs or feature requests, please reach out to primevivek14@gmail.com