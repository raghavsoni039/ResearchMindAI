# 🧠 ResearchMind AI — Full Technical Document

> **Problem Statement · Solution Architecture · End-to-End Lifecycle**

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Service Layer Deep-Dive](#5-service-layer-deep-dive)
6. [Full API Surface](#6-full-api-surface)
7. [End-to-End Lifecycle](#7-end-to-end-lifecycle)
8. [Security Threat Model](#8-security-threat-model)
9. [Production Readiness](#9-production-readiness)
10. [AWS Deployment Architecture](#10-aws-deployment-architecture)
11. [CI/CD Pipeline](#11-cicd-pipeline)
12. [Known Limitations & Roadmap](#12-known-limitations--roadmap)

---

## 1. Problem Statement

### The Research Reading Crisis

Researchers, students, and professionals routinely deal with hundreds of academic papers. Each paper is typically 8–30 dense pages of domain-specific content. The core problems:

| Pain Point | Reality |
|---|---|
| **Volume** | Thousands of papers published daily on arXiv alone |
| **Time** | Average paper takes 2–5 hours to fully absorb |
| **Cross-paper analysis** | Manual comparison across 5+ papers takes days |
| **Citation formatting** | Tedious, error-prone, style-guide-dependent |
| **Context loss** | Hard to remember insights from papers read weeks ago |
| **No interaction** | PDFs are static — you cannot ask them questions |

### What Doesn't Exist (Gap)

Existing tools are either:
- **Too generic** — ChatGPT doesn't know your specific uploaded papers
- **Too narrow** — citation managers don't answer questions
- **Too expensive** — enterprise research platforms cost thousands per month
- **Hallucination-prone** — general LLMs make up facts not in the paper

### The Core Requirement

A system that can:
1. **Ingest** any PDF research paper
2. **Understand** its content at a semantic level, not just keyword search
3. **Answer questions** grounded exclusively in the uploaded documents
4. **Compare** multiple papers across structured dimensions
5. **Generate citations** in all academic formats
6. **Export** analysis in any format
7. **Remember** conversation context across sessions

---

## 2. Solution Overview

**ResearchMind AI** is a full-stack, AI-powered research assistant built on a **Retrieval-Augmented Generation (RAG)** architecture. It bridges the gap between static PDF documents and conversational AI.

### RAG Core Concept

```mermaid
flowchart LR
    A["📄 Upload PDF"] --> B["Split into\nChunks"]
    B --> C["Generate\nEmbeddings"]
    C --> D[("ChromaDB\nVector Store")]

    E["❓ User Question"] --> F["Embed\nQuestion"]
    F --> G["Similarity\nSearch"]
    D --> G
    G --> H["Top 5\nRelevant Chunks"]
    H --> I["Build\nContext Prompt"]
    I --> J["🤖 Gemini Flash"]
    J --> K["✅ Grounded Answer"]
```

### Feature Set

| Feature | Description | Powered By |
|---|---|---|
| PDF Upload & Indexing | Upload, extract, chunk, embed | PyMuPDF + LangChain + Gemini Embeddings |
| AI Chat | Natural language Q&A over papers | RAG + Gemini Flash |
| Paper Comparison | Structured multi-paper analysis | Gemini Flash + ChromaDB |
| Citation Generator | APA, MLA, IEEE, Chicago, Harvard, BibTeX | Gemini Flash |
| Semantic Search | Meaning-based document search | ChromaDB Vector Search |
| Export | PDF, Word, Markdown, HTML, CSV, JSON, TXT | PyMuPDF, python-docx |
| Chat History | Persistent sessions with memory | JSON file storage |
| Dashboard | Real-time stats and analytics | FastAPI + Next.js |

---

## 3. Technology Stack

### Stack Overview

```mermaid
graph TD
    subgraph FE["🌐 Frontend — Next.js 16"]
        NX["Next.js 16 + React 19\nTypeScript"]
        TW["Tailwind CSS v4\nShadcn/UI"]
        FM["Framer Motion\nAnimations"]
        RC["Recharts\nAnalytics"]
        RMD["React Markdown\nAI Response Rendering"]
    end

    subgraph BE["⚡ Backend — FastAPI"]
        FA["FastAPI + Pydantic v2"]
        LC["LangChain\nOrchestration"]
        MF["PyMuPDF\nPDF Extraction"]
        CDB2["ChromaDB Client"]
        GV["Gunicorn + Uvicorn\nProduction Server"]
    end

    subgraph AI["🤖 AI — Google Gemini"]
        EMB["gemini-embedding-001\n768-dim vectors"]
        GEN["gemini-3.5-flash\nText Generation"]
    end

    subgraph ST["💾 Storage"]
        UPL["app/uploads/\nPDF Files"]
        VEC["app/database/chroma/\nVector Store"]
        CHAT["storage/chat_history/\nJSON Sessions"]
    end

    FE -->|HTTP REST| BE
    BE --> AI
    BE --> ST
```

---

## 4. System Architecture

### High-Level System Map

```mermaid
graph TD
    U["👤 User Browser"] -->|"fetch() HTTP REST"| FE

    subgraph FE["🌐 Next.js 16 — Port 3000"]
        D["Dashboard"]
        UP["Upload"]
        CH["Chat"]
        CM["Compare"]
        LB["Library"]
        CI["Citation"]
        EX["Export"]
    end

    FE -->|"HTTP REST JSON\nto Port 8000"| ROUTER

    subgraph BE["⚡ FastAPI Backend — Port 8000"]
        ROUTER["API Router Layer\n/documents /chat /summary\n/compare /citation /convert /dashboard"]
        SVC["Service Layer\n20 Services"]
        ROUTER --> SVC
    end

    SVC --> CDB
    SVC --> GMN

    subgraph CDB["🗄️ ChromaDB — Local Disk"]
        COL["Collection: researchmind_documents\ntext chunks + embeddings + metadata"]
    end

    subgraph GMN["🤖 Google Gemini API"]
        EMB2["gemini-embedding-001\ntext → 768-dim vectors"]
        GFL["gemini-3.5-flash\nanswer generation"]
    end
```

### File System Layout

```
ResearchMindAI/
├── backend/
│   ├── app/
│   │   ├── uploads/               ← Raw PDFs stored with UUID names
│   │   │   └── a3f8d2c1...pdf
│   │   ├── database/
│   │   │   └── chroma/            ← ChromaDB persistent store
│   │   │       └── chroma.sqlite3
│   │   ├── api/routes/            ← FastAPI route handlers (11 files)
│   │   ├── services/              ← Business logic (20 services)
│   │   ├── core/                  ← Config, logger, LLM initialisation
│   │   ├── rag/                   ← Vector store client
│   │   ├── schemas/               ← Pydantic request/response models
│   │   └── utils/                 ← Export format utilities
│   └── storage/
│       └── chat_history/          ← JSON chat session files
│           └── {uuid}.json
└── frontend/
    └── src/
        ├── app/                   ← Next.js App Router pages
        └── components/            ← Reusable React components
```

---

## 5. Service Layer Deep-Dive

### 5.1 PDF Ingestion Pipeline

```mermaid
flowchart TD
    A(["User selects PDF"]) --> B["POST /documents/upload\nmultipart/form-data"]
    B --> C["UploadService.validate_file()"]
    C --> D{".pdf extension?"}
    D -->|No| E["HTTP 400\nOnly PDF allowed"]
    D -->|Yes| F["PDFService.save_pdf()"]
    F --> G["Save to app/uploads/\nas UUID.pdf"]
    G --> H["PyMuPDF fitz.open()"]
    H --> I["Loop every page\nextract text"]
    I --> J["ChunkService.create_chunks()"]
    J --> K["RecursiveCharacterTextSplitter\nchunk_size=1000\nchunk_overlap=200"]
    K --> L["EmbeddingService.store_document()"]
    L --> M["gemini-embedding-001\nbatch embed all chunks\n→ 768-dim vectors"]
    M --> N["ChromaDB collection.add()\nuuid + vector + text + metadata"]
    N --> O["Return DocumentResponse\npages, chunks, vector_ids"]
    O --> P(["Frontend: success toast\nPaper appears in Library"])

    style E fill:#ff6b6b,color:#fff
    style P fill:#51cf66,color:#fff
```

### 5.2 RAG Query Pipeline

```mermaid
flowchart TD
    A(["User sends question"]) --> B["POST /chat/\nsession_id + question"]
    B --> C["ChatService.chat()"]

    C --> D["MemoryService.get_history()\nload in-memory conversation"]
    C --> E["RetrievalService.retrieve()"]

    E --> F["Embed question\ngemini-embedding-001\n→ 768-dim vector"]
    F --> G["ChromaDB cosine\nsimilarity search\nn_results=5"]
    G --> H["Top 5 most relevant\nchunks returned"]

    D --> I["Build structured prompt"]
    H --> I

    I --> J["Prompt layers:\nSystem Guard\nConversation History\nRetrieved Context\nUser Question"]
    J --> K["gemini-3.5-flash\nasync LLM call"]
    K --> L["parse_gemini_response()\nclean output"]

    L --> M["MemoryService.add_message()\nuser + assistant to RAM"]
    M --> N["ChatHistoryService.save_message()\npersist to JSON file"]
    N --> O["Auto-rename session\nif title == New Chat"]
    O --> P(["Return: answer + sources\n+ timestamp + session_id"])

    style A fill:#339af0,color:#fff
    style P fill:#51cf66,color:#fff
```

### 5.3 Summary Pipeline

```mermaid
flowchart TD
    A(["POST /summary\nfilename"]) --> B["SummaryService.generate_summary()"]
    B --> C["ChromaDB collection.get()\nfetch ALL chunks"]
    C --> D["Filter chunks\nwhere filename matches"]
    D --> E["Sort chunks\nby page number"]
    E --> F["Join all text\ninto full_text"]
    F --> G["Truncate to 25,000 chars\ntoken safety limit"]
    G --> H["GeminiService.generate_summary()"]
    H --> I["Structured prompt requesting:\nExecutive Summary\nObjective · Methodology\nKey Findings · Strengths\nLimitations · Future Work\nConclusion"]
    I --> J["gemini-3.5-flash"]
    J --> K(["Markdown summary returned\nto frontend"])

    style K fill:#51cf66,color:#fff
```

### 5.4 Comparison Pipeline

```mermaid
flowchart TD
    A(["POST /compare\nfilenames list"]) --> B["CompareService.compare()"]
    B --> C["ChromaDB collection.get()\nfetch all chunks"]

    C --> D1["Filter chunks\nfor Paper A\nsort + join\ntruncate 12,000 chars"]
    C --> D2["Filter chunks\nfor Paper B\nsort + join\ntruncate 12,000 chars"]
    C --> D3["Filter chunks\nfor Paper C...\n..."]

    D1 --> E["GeminiService.compare_documents()"]
    D2 --> E
    D3 --> E

    E --> F["Structured prompt requesting:\nExecutive Overview\nResearch Objectives\nMethodology Comparison\nDataset Comparison\nAlgorithms Used\nKey Findings\nStrengths & Weaknesses\nFinal Recommendation"]
    F --> G["gemini-3.5-flash"]
    G --> H(["Rich markdown comparison\nwith tables returned"])

    style H fill:#51cf66,color:#fff
```

### 5.5 Citation Pipeline

```mermaid
flowchart TD
    A(["POST /citation\nfilename"]) --> B["CitationService"]
    B --> C["Fetch full text\nfrom ChromaDB"]
    C --> D["GeminiService.generate_citations()"]
    D --> E["Prompt: extract metadata\nTitle · Authors · Year\nJournal · DOI"]
    E --> F["gemini-3.5-flash\nreturn ONLY valid JSON"]
    F --> G["json.loads() validation"]
    G --> H{Valid JSON?}
    H -->|Yes| I(["Return citations object\napa · mla · ieee\nchicago · harvard · bibtex"])
    H -->|No| J(["Return empty citation fields"])

    style I fill:#51cf66,color:#fff
    style J fill:#ff6b6b,color:#fff
```

### 5.6 Export/Converter Pipeline

```mermaid
flowchart TD
    A(["POST /convert\nfilename + format"]) --> B["ConverterService.convert()"]
    B --> C["ChromaDB: fetch all chunks\nfor this filename"]
    C --> D["Sort by page + join\n→ full content string"]
    D --> E{Export Format?}

    E -->|docx| F1["export_word()\npython-docx"]
    E -->|pdf| F2["export_pdf()\nreportlab"]
    E -->|txt| F3["export_text()"]
    E -->|md| F4["export_markdown()"]
    E -->|html| F5["export_html()"]
    E -->|csv| F6["export_csv()"]
    E -->|json| F7["export_json()"]
    E -->|other| F8["HTTP 400\nUnsupported format"]

    F1 --> G["Save to tempfile\ndirectory"]
    F2 --> G
    F3 --> G
    F4 --> G
    F5 --> G
    F6 --> G
    F7 --> G

    G --> H(["FileResponse\nbrowser downloads file"])

    style H fill:#51cf66,color:#fff
    style F8 fill:#ff6b6b,color:#fff
```

### 5.7 Chat Memory Architecture

```mermaid
graph TD
    subgraph T1["⚡ Tier 1 — In-Memory RAM"]
        MS["MemoryService.conversations\nPython dict\nFast access for prompt building\nLOST on server restart"]
    end

    subgraph T2["💾 Tier 2 — File System JSON"]
        FS["storage/chat_history/uuid.json\nPermanent persistence\nChat sidebar display\nSurvives restarts"]
    end

    Q["User Question"] --> MS
    Q --> FS
    MS -->|"last N messages\nfor context"| PROMPT["LLM Prompt"]
    FS -->|"session list\nfor sidebar"| UI["Frontend Sidebar"]
```

---

## 6. Full API Surface

| Method | Endpoint | Description | Input | Output |
|---|---|---|---|---|
| `POST` | `/documents/upload` | Upload & index PDF | `multipart/form-data` | `DocumentResponse` |
| `GET` | `/documents` | List all documents | — | `{documents}` |
| `GET` | `/documents/search/{query}` | Keyword search | URL param | `{documents}` |
| `GET` | `/documents/semantic-search/{query}` | Vector search | URL param | `{documents}` |
| `DELETE` | `/documents/{filename}` | Delete document | URL param | `{success}` |
| `GET` | `/documents/view/{filename}` | View PDF inline | URL param | `FileResponse` |
| `GET` | `/documents/download/{filename}` | Download PDF | URL param | `FileResponse` |
| `POST` | `/chat/new` | Create chat session | — | `{session}` |
| `POST` | `/chat/` | Send message, get AI answer | `{session_id, question}` | `{answer, sources}` |
| `GET` | `/chat/sessions` | List all sessions | — | `{sessions}` |
| `GET` | `/chat/{session_id}` | Load a session | URL param | `{session}` |
| `DELETE` | `/chat/{session_id}` | Delete session | URL param | `{success}` |
| `PUT` | `/chat/{session_id}/rename` | Rename session | Query param | `{success}` |
| `POST` | `/summary` | Generate paper summary | `{filename}` | `{summary}` |
| `POST` | `/compare` | Compare multiple papers | `{filenames[]}` | `{comparison}` |
| `POST` | `/citation` | Generate citations | `{filename}` | `{apa, ieee, ...}` |
| `POST` | `/convert` | Export document | `{filename, format}` | `FileResponse` |
| `GET` | `/export/` | Export report | varies | `FileResponse` |
| `GET` | `/dashboard` | Get usage stats | — | `{papers, pages, chunks}` |
| `GET` | `/health` | Health check | — | `{status}` |

---

## 7. End-to-End Lifecycle

### Lifecycle A — Document Upload

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as Next.js Frontend
    participant FA as FastAPI
    participant US as UploadService
    participant PS as PDFService
    participant CS as ChunkService
    participant ES as EmbeddingService
    participant CDB as ChromaDB
    participant GM as Gemini API

    U->>FE: Select PDF file
    FE->>FA: POST /documents/upload (multipart)
    FA->>US: validate_file()
    US-->>FA: Valid PDF confirmed
    FA->>PS: save_pdf(file)
    PS->>PS: Write UUID.pdf to uploads/
    PS->>PS: PyMuPDF: extract text per page
    PS->>CS: create_chunks(page_text)
    CS-->>PS: chunks list (1000 chars, 200 overlap)
    PS->>ES: store_document(chunks, filename)
    ES->>GM: embed_documents(texts)
    GM-->>ES: 768-dim vectors for each chunk
    ES->>CDB: collection.add(ids, vectors, texts, metadata)
    CDB-->>ES: Stored successfully
    ES-->>FA: vector_ids list
    FA-->>FE: DocumentResponse (pages, chunks, vectors)
    FE-->>U: Success toast + Library updated
```

### Lifecycle B — AI Chat Question

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as Next.js Frontend
    participant FA as FastAPI
    participant CHS as ChatService
    participant MEM as MemoryService
    participant RET as RetrievalService
    participant CDB as ChromaDB
    participant GEM as GeminiService
    participant GM as Gemini API
    participant HIST as ChatHistoryService

    U->>FE: Type question + press Send
    FE->>FA: POST /chat/ {session_id, question}
    FA->>CHS: chat(session_id, question)
    CHS->>MEM: get_history(session_id)
    MEM-->>CHS: Last N conversation messages
    CHS->>RET: retrieve(question, k=5)
    RET->>GM: embed_query(question) → 768-dim vector
    GM-->>RET: question embedding
    RET->>CDB: query(embedding, n_results=5)
    CDB-->>RET: Top 5 similar chunks + metadata
    RET-->>CHS: chunks with filename + page info
    CHS->>GEM: generate_answer(question, context, history)
    GEM->>GM: ainvoke(structured prompt)
    GM-->>GEM: Grounded answer text
    GEM-->>CHS: Parsed answer string
    CHS->>MEM: add_message(user + assistant)
    CHS->>HIST: save_message() → JSON file
    CHS->>HIST: rename session if New Chat
    FA-->>FE: {answer, sources, timestamp}
    FE-->>U: Answer rendered as Markdown
```

### Lifecycle C — Paper Comparison

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as Next.js Frontend
    participant FA as FastAPI
    participant CMP as CompareService
    participant CDB as ChromaDB
    participant GEM as GeminiService
    participant GM as Gemini API

    U->>FE: Select papers A and B, click Compare
    FE->>FA: POST /compare {filenames: ["A.pdf", "B.pdf"]}
    FA->>CMP: compare(filenames)
    CMP->>CDB: collection.get() — all chunks
    CDB-->>CMP: All stored chunks + metadata
    CMP->>CMP: Filter chunks for A.pdf\nsort by page + join + truncate 12000
    CMP->>CMP: Filter chunks for B.pdf\nsort by page + join + truncate 12000
    CMP->>GEM: compare_documents([{A text}, {B text}])
    GEM->>GM: ainvoke(structured comparison prompt)
    GM-->>GEM: Markdown comparison with tables
    GEM-->>FA: Parsed comparison string
    FA-->>FE: {comparison markdown}
    FE-->>U: Rich comparison rendered with tables
```

---

## 8. Security Threat Model

### Attack Surface Map

```mermaid
graph TD
    ATK["🔴 External Attacker"]

    ATK --> T1["Prompt Injection\nvia Chat Question\nForget everything..."]
    ATK --> T2["API Abuse\nNo Authentication\nAnyone can call any endpoint"]
    ATK --> T3["Upload Bomb\n5GB file accepted\nServer OOM crash"]
    ATK --> T4["Error Reconnaissance\nstr(e) sent to client\nLeaks paths + versions"]
    ATK --> T5["Memory Exhaustion\nUnbounded chat history\nRAM grows forever"]
    ATK --> T6["API Key Theft\n.env in git history\nInstant quota drain"]
    ATK --> T7["Filename Injection\nIgnore above dot pdf\nInjected into LLM prompt"]
    ATK --> T8["Rate Limit Abuse\n1000 chat calls/min\nGemini bill explosion"]

    T1 --> S1["FIX: System guard prompt\n+ injection regex filter\n+ input length cap"]
    T2 --> S2["FIX: API key header auth\non all FastAPI routers"]
    T3 --> S3["FIX: Enforce MAX_FILE_SIZE\nbefore disk write"]
    T4 --> S4["FIX: Generic error messages\nlog full details server-side"]
    T5 --> S5["FIX: Cap history to\nlast 20 messages"]
    T6 --> S6["FIX: Add .env to .gitignore\nRotate compromised keys\nUse AWS Secrets Manager"]
    T7 --> S7["FIX: sanitize_for_prompt()\nstrip special chars\nlimit to 200 chars"]
    T8 --> S8["FIX: slowapi rate limiter\n10/min chat, 5/min upload"]

    style ATK fill:#ff0000,color:#fff
    style T1 fill:#ff6b6b,color:#fff
    style T2 fill:#ff6b6b,color:#fff
    style T3 fill:#ff9f43,color:#fff
    style T4 fill:#ff9f43,color:#fff
    style T5 fill:#ff9f43,color:#fff
    style T6 fill:#ffd43b
    style T7 fill:#ffd43b
    style T8 fill:#ffd43b
    style S1 fill:#51cf66,color:#fff
    style S2 fill:#51cf66,color:#fff
    style S3 fill:#51cf66,color:#fff
    style S4 fill:#51cf66,color:#fff
    style S5 fill:#51cf66,color:#fff
    style S6 fill:#51cf66,color:#fff
    style S7 fill:#51cf66,color:#fff
    style S8 fill:#51cf66,color:#fff
```

### Security Fix Priority Table

| Priority | Issue | File to Change |
|---|---|---|
| 🔴 Critical | Prompt injection / LLM jailbreak | `gemini_service.py` |
| 🔴 Critical | No API authentication | All routers + new `security.py` |
| 🟠 High | File size not enforced | `upload_service.py` |
| 🟠 High | Error details leaked to client | All route files |
| 🟠 High | Unbounded memory growth | `memory_service.py` |
| 🟠 High | Filename injected into prompts | `gemini_service.py`, `compare_service.py` |
| 🟡 Medium | No rate limiting | `main.py` + AI routes |
| 🟡 Medium | `.env` commit risk | `.gitignore` + git audit |
| 🟡 Medium | CORS — never use wildcard | `main.py` |

---

## 9. Production Readiness

### What Must Change Before Going Live

#### Replace All Hardcoded URLs (20 files affected)

```typescript
// 1. Create frontend/src/lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// 2. Replace every instance of:
fetch("http://127.0.0.1:8000/...")

// 3. With:
import { API_URL } from "@/lib/api";
fetch(`${API_URL}/...`)
```

#### Environment Files

```bash
# frontend/.env.local  (npm run dev)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# frontend/.env.production  (npm run build)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# backend/.env  (production)
GOOGLE_API_KEY=<from AWS Secrets Manager>
API_SECRET_KEY=<openssl rand -hex 32>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Production Server Command

```bash
# Development (single-threaded, auto-reload — NEVER use in prod)
uvicorn app.main:app --reload

# Production (multi-worker, stable)
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --workers 4 \
  --bind 0.0.0.0:8000 \
  --timeout 120
```

#### Pre-Deploy Checklist

```
[ ] All hardcoded 127.0.0.1:8000 URLs replaced
[ ] NEXT_PUBLIC_API_URL set in deployment environment
[ ] CORS locked to production domain only
[ ] API authentication on all routes
[ ] Prompt injection guard implemented
[ ] Rate limiting on all AI endpoints
[ ] File size enforcement working
[ ] Error messages sanitized
[ ] Chat memory capped at 20 messages
[ ] .env NOT committed to git
[ ] Google API key rotated if ever exposed
[ ] next.config.ts output: "standalone" added
[ ] gunicorn in requirements.txt
[ ] Docker compose tested locally
[ ] HTTPS certificate provisioned
[ ] Health endpoint responding
[ ] ChromaDB persistence confirmed
```

---

## 10. AWS Deployment Architecture

### Recommended Architecture — EC2

```mermaid
graph TD
    USER["👤 Users\nInternet"] --> R53

    R53["Route 53\nDNS: researchmind.ai\n→ EC2 Elastic IP"]

    R53 --> CF["CloudFront CDN\nOptional: cache static assets"]
    CF --> EC2

    subgraph EC2["🖥️ EC2 t3.medium — Ubuntu 24.04"]
        NGINX["Nginx\nPort 80 → 443 redirect\nSSL Termination\nCertbot Let's Encrypt"]

        NGINX -->|"/ all routes"| FEC["Docker: Frontend\nNext.js Port 3000"]
        NGINX -->|"/api/* routes"| BEC["Docker: Backend\nFastAPI + Gunicorn Port 8000"]

        BEC --> EBS

        subgraph EBS["EBS Volume 20GB — Attached"]
            CHR["app/database/chroma/\nChromaDB persists here"]
            UPL2["app/uploads/\nPDF files persist here"]
            STO["storage/chat_history/\nJSON sessions persist here"]
        end
    end

    BEC --> GAPI["Google Gemini API\nExternal service"]

    style EC2 fill:#e3f2fd
    style EBS fill:#fff9c4
    style GAPI fill:#f3e5f5
```

### AWS Service Comparison

```mermaid
graph LR
    subgraph EC2OPT["EC2 t3.medium"]
        EC2I["Setup: Hard\nCost: ~30/mo\nScaling: Manual\nChromaDB: Native EBS\nHTTPS: Certbot manual\nBest for: Solo + full control"]
    end

    subgraph ECSO["ECS + Fargate"]
        ECSI["Setup: Medium\nCost: ~50-80/mo\nScaling: Auto built-in\nChromaDB: Needs EFS\nHTTPS: Via ALB\nBest for: Team + scale-up"]
    end

    subgraph EBS2["Elastic Beanstalk"]
        EBSI["Setup: Low\nCost: ~40-60/mo\nScaling: Auto\nChromaDB: Complex\nHTTPS: Auto\nBest for: Middle ground"]
    end

    subgraph ARO["App Runner"]
        AROI["Setup: Lowest\nCost: ~20/mo\nScaling: To zero\nChromaDB: NOT suitable\nHTTPS: Auto\nBest for: Stateless APIs only"]
    end
```

### Docker Compose — Production Stack

```yaml
version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    volumes:
      - chroma_data:/app/app/database/chroma
      - upload_data:/app/app/uploads
      - chat_data:/app/storage
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  chroma_data:
  upload_data:
  chat_data:
```

---

## 11. CI/CD Pipeline

### Deployment Flow

```mermaid
flowchart TD
    DEV(["Developer\ngit push origin main"]) --> GH["GitHub\nRepository"]
    GH --> GA["GitHub Actions\nWorkflow triggered"]
    GA --> SSH["SSH into EC2\nvia appleboy/ssh-action"]
    SSH --> PULL["git pull origin main"]
    PULL --> DOWN["docker compose down\nstop all containers"]
    DOWN --> BUILD["docker compose up --build\nrebuild + restart"]
    BUILD --> HC["Health Check\ncurl localhost:8000/health"]
    HC --> OK{Status 200?}
    OK -->|Yes| LIVE(["✅ Live at\nhttps://researchmind.ai"])
    OK -->|No| FAIL(["❌ Deploy Failed\nAlert sent"])

    style DEV fill:#339af0,color:#fff
    style LIVE fill:#51cf66,color:#fff
    style FAIL fill:#ff6b6b,color:#fff
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy ResearchMind AI

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          timeout: 300s
          script: |
            cd /home/ubuntu/ResearchMindAI
            git pull origin main
            docker compose down
            docker compose up -d --build
            sleep 10
            curl -f http://localhost:8000/health || exit 1
            echo "Deploy successful"
```

---

## 12. Known Limitations & Roadmap

### Current Technical Debt

| Limitation | Severity | Impact | Fix |
|---|---|---|---|
| No authentication | High | Single-user, no isolation | Clerk / Auth0 |
| ChromaDB on local disk | High | Lost on container restart | EFS or Pinecone |
| Chat memory in RAM | Medium | Lost on server restart | Redis |
| Chat history in JSON | Medium | Doesn't scale past ~10k sessions | PostgreSQL |
| File size not enforced | High | OOM / DoS risk | Fix in upload_service.py |
| No rate limiting | High | Gemini bill explosion | slowapi |
| No response streaming | Low | AI feels slow | Server-Sent Events |
| Single-tenant design | Medium | All users share document pool | Add user_id scoping |

### Version Roadmap

```mermaid
timeline
    title ResearchMind AI — Version Roadmap
    section v1.0 (Current)
        PDF Upload        : PDF ingestion + chunking + embedding
        AI Chat           : RAG-based Q&A with memory
        Comparison        : Multi-paper structured analysis
        Citation          : 6 academic citation formats
        Export            : 7 output formats
    section v2.0
        Authentication    : Multi-user support via Clerk
        Streaming         : Server-Sent Events for live AI responses
        Redis Memory      : Persistent session memory
        PostgreSQL        : Scalable chat history storage
    section v3.0
        Voice             : Voice input and output
        Multi-language    : Support for non-English papers
        Knowledge Graph   : Visual paper relationship maps
        Collaboration     : Shared workspaces for teams
        Managed Vector DB : Pinecone or Weaviate migration
```

---

## Summary

ResearchMind AI is a complete RAG-based research assistant built with:

- **7-step document ingestion** — upload → validate → extract → chunk → embed → store → index
- **7-step RAG query** — receive → load memory → embed question → retrieve chunks → build prompt → generate → persist
- **10 distinct API feature areas** across 20+ endpoints
- **Dual-tier memory** — RAM for speed, JSON for persistence
- **7 export formats** — PDF, Word, Markdown, HTML, CSV, JSON, TXT
- **10 security vulnerabilities identified** — all with specific implementable fixes
- **Production path** — EC2 + Docker + Nginx + Certbot + GitHub Actions CI/CD

The architecture is intentionally modular — each of the 20 services is independent, making it straightforward to swap components: ChromaDB → Pinecone, Gemini → OpenAI, JSON history → PostgreSQL, without restructuring the system.
