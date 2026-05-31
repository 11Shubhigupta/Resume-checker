# 🎯 TalentScope AI - Resume Screening & Candidate Ranking Web Hub

TalentScope AI is an enterprise-grade, full-stack web application designed to automate resume screening and candidate ranking. By comparing uploaded resumes (PDF, DOCX, TXT) against a Job Description (JD), the system parses, extracts, and evaluates candidate fit using custom offline NLP scoring algorithms, presenting results in a stunning, interactive glassmorphic dashboard.

---

## 🌟 Key Features

*   **⚡ Drag-and-Drop Batch Resume Uploader**: Seamlessly upload single or multiple resumes in PDF, DOCX, DOC, or TXT formats with live file previews, size metrics, and drag-active laser scan indicators.
*   **📋 Interactive Job Description Console**: Paste custom JDs manually, upload JD files, or use pre-configured, quick-fill templates (e.g., *React Frontend Developer*, *Python Data Scientist*) to speed up recruitment testing.
*   **🧠 Multidimensional Custom Scoring Scorer**: Performs high-fidelity NLP evaluations without relying on external paid API keys:
    *   **Skills Alignment (40%)**: Map standard professional skills catalogs against raw candidate text profiles.
    *   **Experience & Timeline Relevance (25%)**: Parses career spans and explicit text milestones (e.g. *"2018 - 2022"*) to calculate exact years of experience against requirements.
    *   **Academic Credentials Match (15%)**: Maps candidate degrees to educational hierarchies (PhD -> Master -> Bachelor -> Associate) to score academic fit.
    *   **Vocabulary Similarity Matrix (20%)**: Calculates a TF-IDF equivalent Cosine Similarity coefficient of clean, stopword-filtered texts.
*   **📊 Rich Responsive Results Dashboard**:
    *   *High-Level Analytics*: Displays total candidates, top score matching, average fit ratings, and strong match counts.
    *   *Sort & Search controls*: Instant live-filter search by candidate name or tech skills; sort by highest score, lowest score, experience, or name (A-Z).
    *   *Recruitment Pipelines*: Filter and categorize candidates by status (*Screened*, *Shortlisted*, *Interviewing*, *Rejected*).
*   **📑 Sliding Candidate Analysis Drawer**: Slide open applicant cards to view sub-score charts, matched vs. missing skills reconciliation checklists, parsed resume summaries, and annotation input boxes.
*   **📥 Dynamically Generated CSV Export**: Download a detailed spreadsheet ranking and summarizing all evaluated candidates in one click.
*   **💫 Premium Motion-Graphics Styling**: A responsive deep-space dark aesthetic styled with **Vanilla CSS** featuring floating background nebulas, sweeping radial circular gauges, and spring-loaded stagger entry delays.

---

## 🛠 Tech Stack

### Frontend
*   **Vite + React.js**: Fast, stateless single-page app framework.
*   **Lucide React**: Premium typography icons.
*   **Vanilla CSS**: Custom CSS properties, HSL space grids, responsive layout flexboxes, and interactive CSS keyframes.

### Backend
*   **Node.js + Express**: REST API backend server.
*   **Multer**: Safe file upload buffer management.
*   **pdf-parse & mammoth**: Native JavaScript buffer-level PDF & DOCX readers (ensures zero native compiler binary dependencies on Windows/Linux).

---

## 📂 Project Architecture

```
/Resume-checker
  ├── package.json                   # Root orchestrator (runs concurrently in dev)
  ├── vercel.json                    # Vercel Monorepo Serverless Deployment blueprints
  ├── README.md                      # Documentation
  ├── /backend
  │     ├── package.json             # Multer, Express, pdf-parse, mammoth
  │     ├── server.js                # Express API endpoints & URL prefix middleware
  │     ├── parser.js                # Text extractors
  │     └── scorer.js                # NLP skills, experience, & cosine calculations
  └── /frontend
        ├── package.json             # React, Vite, Lucide dependencies
        ├── vite.config.js           # Vite dev proxies targeting port 5005
        ├── index.html               # Main HTML shell (Google Fonts loads Outfit & Inter)
        └── /src
              ├── main.jsx           # Mounting entry
              ├── App.jsx            # State & Step controller (SETUP, SCREENING, RESULTS)
              ├── index.css          # Color design system, nebulas, stagger animations
              └── /components
                    ├── JobInput.jsx        # JD presets & uploader card
                    ├── ResumeUpload.jsx    # Drag-drop file dropzone
                    ├── LoadingScreen.jsx   # Radar scanning progresses
                    ├── Dashboard.jsx       # Results filters, exports, & metrics
                    ├── CandidateCard.jsx   # SVG circular gauge item
                    └── CandidateDrawer.jsx # Slide-out charts & reconciliation checks
```

---

## 🚀 Installation & Local Launch

Ensure you have [Node.js](https://nodejs.org/) installed, and follow these simple commands:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/11Shubhigupta/Resume-checker.git
    cd Resume-checker
    ```
2.  **Install All Dependencies**:
    Initialize packages for root, frontend, and backend recursively:
    ```bash
    npm run install-all
    ```
3.  **Boot the Concurrently Dev Environment**:
    ```bash
    npm run dev
    ```
4.  **Access the Application**:
    Open your browser and navigate to:
    👉 **[http://localhost:3000](http://localhost:3000)**
    *(The backend automatically boots on port `5005` to avoid system port collisions).*

---

## ⚡ Global Deployment Configuration

### 1. Vercel Monorepo (Automatic)
The project is pre-configured for Vercel using the modern `experimentalServices` monorepo configuration:
*   Import this repository directly into Vercel.
*   Leave all settings as default (do not edit root directories).
*   Vercel will build the frontend using Vite and host the Express routes as Serverless Functions under `/api/*` seamlessly, utilizing the temporary serverless file-writing buffers (`os.tmpdir()`) we integrated.

### 2. Manual Separated Deploy (Vercel + Render)
*   **Backend (Render)**: Deploy the `backend` folder as a Node Web Service on Render (Build: `npm install`, Start: `node server.js`).
*   **Frontend (Vercel)**: Deploy the `frontend` folder as a Vite React static site on Vercel.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---

*Developed with 🎯 and 💫 by [Ananya & Shubhi Gupta](https://github.com/11Shubhigupta)*
