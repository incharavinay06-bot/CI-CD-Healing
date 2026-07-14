# Deployment Instructions - Autonomous CI/CD Healing Agent

Follow these guides to compile, build, and deploy this full-stack application to production.

---

## 1. Quick Local Setup (Docker Compose)
The simplest way to run both the React frontend and the Python backend is through **Docker Compose**:

1. Ensure Docker is running.
2. In the root project directory, run:
   ```bash
   docker-compose -f deliverables/docker-compose.yml up --build
   ```
3. Set your environment variable:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Access the web dashboard at `http://localhost:8000`.

---

## 2. Deploying to Render (Full-Stack Container)
Render supports deploying containers directly. This is ideal since our application requires `git` and linter command binaries (`flake8`, `mypy`).

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the following service settings:
   - **Runtime**: `Docker`
   - **Docker Path**: `deliverables/Dockerfile`
   - **Instance Type**: `Free` or `Starter`
5. Click **Advanced** and add your environment variable:
   - `GEMINI_API_KEY` = `your-actual-gemini-api-key`
6. Click **Deploy Web Service**. Render will build the React SPA, compile the Python FastAPI server, and host them on a unified public URL.

---

## 3. Deploying to Vercel (Frontend Client Only)
If you prefer to host the React client separately on Vercel:

1. Install Vercel CLI or log in to the Vercel Dashboard.
2. Link your repository.
3. Configure Vercel build parameters:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables if you are pointing to a remote hosted FastAPI backend:
   - `VITE_API_URL` = `https://your-fastapi-backend-url.render.com`
5. Deploy using the CLI:
   - `vercel --prod`

---

## 4. Manual Local Installation

### Backend Setup (FastAPI)
1. Navigate to the deliverables folder:
   ```bash
   cd deliverables
   ```
2. Set up a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn backend_fastapi:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup (Vite + React)
1. Navigate to the root directory and install npm packages:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to interact with the healing agent.

---
*Autonomous CI/CD Healing Agent — AI DevOps Platform.*
