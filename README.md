<div align="center">

# 🧠 ResearchMind AI

### 🚀 AI-Powered Research Paper Analysis Platform

<img src="assets/banner.svg" width="100%" alt="ResearchMind AI Banner"/>

<p align="center">

<img src="https://readme-typing-svg.demolab.com?font=Poppins&size=24&pause=1000&color=4F8EF7&center=true&vCenter=true&width=900&lines=AI+Powered+Research+Paper+Assistant;Chat+With+Research+Papers;Compare+Multiple+Research+Papers;Generate+Smart+Citations;Powered+by+Gemini+%2B+FastAPI+%2B+Next.js"/>

</p>

<p align="center">

<a href="https://github.com/ExplorerPVR">
<img src="https://img.shields.io/github/followers/ExplorerPVR?style=for-the-badge&logo=github">
</a>

<a href="https://github.com/ExplorerPVR/ResearchMind-AI/stargazers">
<img src="https://img.shields.io/github/stars/ExplorerPVR/ResearchMind-AI?style=for-the-badge">
</a>

<img src="https://img.shields.io/github/license/ExplorerPVR/ResearchMind-AI?style=for-the-badge">

<img src="https://img.shields.io/github/last-commit/ExplorerPVR/ResearchMind-AI?style=for-the-badge">

<img src="https://komarev.com/ghpvc/?username=ExplorerPVR&style=for-the-badge&color=blue"/>

</p>

---

## 🌟 ResearchMind AI

ResearchMind AI is a modern **AI-powered Research Assistant** that enables researchers, students, and professionals to interact with research papers intelligently.

Instead of manually reading hundreds of pages, users can upload PDFs and let AI:

📄 Understand them

🤖 Answer questions

📊 Compare papers

📚 Generate citations

🔍 Perform semantic search

⚡ Summarize research instantly

---

# 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 📄 PDF Upload | Upload multiple research papers |
| 🤖 AI Chat | Chat with uploaded papers |
| 📊 Compare Papers | AI comparison between papers |
| 📚 Citation Generator | APA, MLA, IEEE & Chicago |
| 🔍 Semantic Search | ChromaDB Vector Search |
| 🧠 Gemini AI | Google's latest LLM |
| 💬 Chat History | Persistent conversations |
| 🌙 Dark Mode | Beautiful UI |
| 📥 Export Reports | PDF, Word, Markdown & TXT |

---

# 🎥 Demo

> Replace the images below with your own screenshots later.

| Dashboard |
|-----------|
| ![](assets/dashboard.png) |

| AI Chat |
|----------|
| ![](assets/chat.png) |

| Compare Papers |
|----------------|
| ![](assets/compare.png) |

| Citation Generator |
|--------------------|
| ![](assets/citations.png) |

---

# ⚡ Technology Stack

## 🎨 Frontend

<p>

<img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind"/>

</p>

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

---

## ⚙ Backend

<p>

<img src="https://skillicons.dev/icons?i=python,fastapi"/>

</p>

- FastAPI
- Python
- LangChain
- ChromaDB
- Pydantic

---

## 🤖 AI

- Google Gemini 2.5 Flash
- RAG Architecture
- Embedding Model
- Semantic Retrieval
- Memory Management

---

# 🖥 Project Preview

<img src="assets/dashboard.png" width="100%">

---
# 🏗️ System Architecture

<div align="center">

```text
                           ┌────────────────────────────┐
                           │        👤 User             │
                           └────────────┬───────────────┘
                                        │
                                        ▼
                     ┌──────────────────────────────────┐
                     │      🌐 Next.js Frontend         │
                     │  Dashboard • Chat • Compare     │
                     └────────────┬─────────────────────┘
                                  │ REST API
                                  ▼
                  ┌─────────────────────────────────────┐
                  │         ⚡ FastAPI Backend          │
                  │ Authentication • AI • Retrieval    │
                  └──────┬──────────────┬──────────────┘
                         │              │
          ┌──────────────┘              └──────────────┐
          ▼                                            ▼
 ┌──────────────────┐                     ┌─────────────────────┐
 │   ChromaDB       │                     │   Gemini AI         │
 │ Vector Database  │                     │ LLM & Embeddings    │
 └─────────┬────────┘                     └─────────┬───────────┘
           │                                        │
           └────────────────────┬───────────────────┘
                                ▼
                  ┌─────────────────────────────┐
                  │      AI Generated Answer    │
                  └─────────────────────────────┘
```

</div>

---

# 🧠 AI Workflow

```text
             📄 Upload PDF
                   │
                   ▼
         Extract Text from PDF
                   │
                   ▼
          Split into Chunks
                   │
                   ▼
      Generate Embeddings (Gemini)
                   │
                   ▼
        Store in ChromaDB
                   │
                   ▼
         User asks Question
                   │
                   ▼
      Semantic Similarity Search
                   │
                   ▼
       Retrieve Relevant Chunks
                   │
                   ▼
         Gemini AI Response
                   │
                   ▼
      Save Chat + Memory + Sources
```

---

# 📂 Project Structure

```text
ResearchMind-AI/
│
├── backend/
│   │
│   ├── app/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── chroma_db/
│   ├── uploads/
│   ├── storage/
│   │    ├── chat_history/
│   │    └── memory/
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── styles/
│   │
│   ├── public/
│   │
│   ├── package.json
│   └── next.config.ts
│
├── assets/
│   ├── banner.svg
│   ├── dashboard.png
│   ├── compare.png
│   ├── upload.png
│   ├── chat.png
│   └── citations.png
│
└── README.md
```

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ExplorerPVR/ResearchMind-AI.git

cd ResearchMind-AI
```

---

## 2️⃣ Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Linux/Mac

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install
```

or

```bash
yarn
```

---

# 🔑 Environment Variables

Create

```text
backend/.env
```

Add

```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY

MODEL_NAME=gemini-2.5-flash

TEMPERATURE=0.3

CHROMA_DB=chroma_db

UPLOAD_FOLDER=uploads
```

---

# ▶ Running the Backend

```bash
uvicorn app.main:app --reload
```

Runs on

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

# ▶ Running the Frontend

```bash
npm run dev
```

Runs on

```
http://localhost:3000
```

---

# 📚 API Documentation

FastAPI automatically provides

- Swagger UI

```
http://127.0.0.1:8000/docs
```

- ReDoc

```
http://127.0.0.1:8000/redoc
```

---

# 🔥 Main API Endpoints

| Endpoint | Description |
|----------|-------------|
| POST /upload | Upload PDFs |
| POST /chat | Chat with papers |
| POST /compare | Compare papers |
| POST /citations | Generate citations |
| GET /documents | List uploaded papers |
| GET /chat/sessions | Fetch chat sessions |
| POST /chat/new | Create new chat |
| DELETE /chat/{id} | Delete chat |

---
# ✨ Core Features

## 🤖 AI Research Assistant

ResearchMind AI understands your uploaded research papers and allows you to ask questions in natural language.

### Capabilities

- 💬 Conversational AI Chat
- 📄 Context-Aware Answers
- 🔍 Semantic Search
- 📚 Source Referencing
- 🧠 Conversation Memory
- ⚡ Fast Retrieval

---

# 📊 Research Paper Comparison

Compare two or more research papers instantly.

### AI compares

- Executive Summary
- Research Objective
- Problem Statement
- Literature Review
- Methodology
- Dataset Used
- Algorithms
- Model Architecture
- Experimental Results
- Evaluation Metrics
- Advantages
- Limitations
- Future Scope
- Final Recommendation

---

# 📚 Citation Generator

Generate professional citations in multiple formats.

Supported styles

✅ APA

✅ MLA

✅ IEEE

✅ Chicago

✅ Harvard

✅ BibTeX

---

# 📄 Export Reports

Every comparison report can be downloaded as

- 📕 PDF
- 📘 Microsoft Word (.docx)
- 📗 Markdown (.md)
- 📄 Plain Text (.txt)

---

# 💬 Smart Chat History

Each conversation includes

- Session Management
- Automatic Chat Titles
- Persistent Storage
- Previous Conversations
- Source Tracking

---

# 📥 Document Upload

Supports

- PDF Upload
- Multiple Documents
- Automatic Chunking
- Embedding Generation
- Metadata Extraction

---

# 🧠 Retrieval-Augmented Generation (RAG)

ResearchMind AI follows a complete RAG pipeline.

```text
Question
     │
     ▼
Vector Search
     │
     ▼
Retrieve Relevant Chunks
     │
     ▼
Gemini AI
     │
     ▼
Grounded Response
```

---

# ⚡ Performance Optimizations

- Vector Database (ChromaDB)
- Semantic Retrieval
- Context Compression
- Chunk-Based Search
- Memory Optimization
- Async FastAPI APIs
- Persistent Chat Sessions

---

# 🎨 User Interface

Beautiful dashboard built using

- Next.js 15
- Tailwind CSS
- Responsive Layout
- Dark Mode
- Light Mode
- Modern Cards
- Animations
- Mobile Friendly

---

# 🛡 Security

ResearchMind AI follows several best practices.

- Secure Environment Variables
- Backend API Isolation
- Input Validation
- Error Handling
- Persistent Storage
- File Validation
- Safe PDF Processing

---

# 📈 Future Roadmap

## Version 2.0

- 🎤 Voice Chat
- 🌐 Multi-language Papers
- 📝 AI Research Notes
- 📈 Graphical Comparisons
- 📊 Research Analytics

---

## Version 3.0

- 🧑‍🤝‍🧑 Team Collaboration
- ☁ Cloud Storage
- 🔐 User Authentication
- 🧠 Knowledge Graph
- 🤖 AI Research Reviewer

---

# 💻 Technologies Used

| Category | Technologies |
|-----------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| AI | Gemini AI |
| Vector Database | ChromaDB |
| PDF Processing | PyMuPDF |
| State Management | React Hooks |
| Export | jsPDF, docx |
| Styling | TailwindCSS |

---

# 📸 Screenshots

## Dashboard

![](assets/dashboard.png)

---

## Upload PDFs

![](assets/upload.png)

---

## AI Chat

![](assets/chat.png)

---

## Paper Comparison

![](assets/compare.png)

---

## Citation Generator

![](assets/citations.png)

---
# 🌟 Why ResearchMind AI?

Research papers are becoming increasingly complex and time-consuming to analyze.

ResearchMind AI simplifies this process by combining:

- 🤖 Artificial Intelligence
- 📚 Research Understanding
- 🔍 Semantic Search
- 📊 Paper Comparison
- 📄 Citation Generation
- ⚡ FastAPI Performance
- 🎨 Beautiful User Experience

The goal is to reduce hours of manual reading into a few minutes of AI-assisted exploration.

---

# 🧪 Testing

The project has been tested for:

### Backend

- ✅ PDF Upload
- ✅ Chat API
- ✅ Compare API
- ✅ Citation API
- ✅ Chat History
- ✅ Memory Management
- ✅ ChromaDB Retrieval

---

### Frontend

- ✅ Dashboard
- ✅ Upload Page
- ✅ Chat Page
- ✅ Compare Page
- ✅ Citation Generator
- ✅ Theme Switching
- ✅ Report Download

---

# 📊 Project Statistics

| Module | Status |
|---------|--------|
| Upload | ✅ Complete |
| AI Chat | ✅ Complete |
| Compare | ✅ Complete |
| Citations | ✅ Complete |
| Downloads | ✅ Complete |
| Chat History | ✅ Complete |
| Settings | ✅ Complete |
| Dashboard | ✅ Complete |

---

# 🚀 Performance

✔ Fast API responses

✔ Semantic Retrieval

✔ Vector Search

✔ Async Processing

✔ Optimized Frontend

✔ Responsive UI

---

# 🤝 Contributing

Contributions are welcome!

### Fork the repository

```bash
git clone https://github.com/ExplorerPVR/ResearchMind-AI.git
```

### Create a feature branch

```bash
git checkout -b feature-name
```

### Commit your changes

```bash
git commit -m "Add new feature"
```

### Push

```bash
git push origin feature-name
```

### Open a Pull Request

---

# 📝 License

This project is licensed under the **MIT License**.

Feel free to use, modify and distribute with attribution.

---

# 👨‍💻 Developer

## Prince Vinayak

AI Engineer • Full Stack Developer • Machine Learning Enthusiast

### 🌐 Connect with me

<p align="center">

<a href="https://github.com/ExplorerPVR">
<img src="https://img.shields.io/badge/GitHub-ExplorerPVR-black?style=for-the-badge&logo=github">
</a>

<a href="https://www.linkedin.com/in/prince-vinayak0709">
<img src="https://img.shields.io/badge/LinkedIn-Prince%20Vinayak-blue?style=for-the-badge&logo=linkedin">
</a>

</p>

---

# 🙏 Acknowledgements

Special thanks to the amazing open-source technologies that made this project possible:

- Google Gemini AI
- FastAPI
- Next.js
- React
- Tailwind CSS
- ChromaDB
- LangChain
- PyMuPDF
- jsPDF
- docx

---

# ⭐ Support the Project

If you found **ResearchMind AI** useful,

please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

<p align="center">

<a href="https://github.com/ExplorerPVR/ResearchMind-AI">
<img src="https://img.shields.io/badge/⭐%20Star%20This%20Repository-yellow?style=for-the-badge">
</a>

</p>

---

<div align="center">

## 🚀 ResearchMind AI

### Making Research Faster, Smarter & Simpler.

Built with ❤️ by **Prince Vinayak**

<img src="assets/banner.svg" width="100%" alt="ResearchMind AI Footer Banner"/>

</div>
