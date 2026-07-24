# 🎓 AWS Free Tier (0$/month) Student Deployment Guide — ResearchMind AI

This guide is specifically designed for **AWS Free Tier** (100% Free — $0 cost) to prevent any unexpected charges.

---

## 🛑 Important Free Tier Rules (Avoid AWS Charges!)

> [!WARNING]
> 1. **Do NOT use Elastic Beanstalk Load Balancer (ALB)** — AWS charges ~$18/month for Application Load Balancers even on Free Tier.
> 2. **Use `t2.micro` (or `t3.micro`)** — Only `t2.micro` (or `t3.micro` in newer regions) is included in the 750 free hours/month.
> 3. **Add 2GB Swap Memory** — `t2.micro` has 1GB RAM. Adding a 2GB swap file prevents memory crashes when building containers.

---

## 🎓 Recommended 100% Free Tier Architecture

```
Option A: Single EC2 t2.micro ($0/mo)
[ Client ] ──► [ EC2 t2.micro (Docker Compose + Nginx) ]

Option B: Vercel + EC2 t2.micro ($0/mo - Best Performance)
[ Client ] ──► [ Vercel (Frontend - Free) ]
                 └──► [ EC2 t2.micro (FastAPI Backend - Free) ]
```

---

## ⚡ Option A: Full Stack on Single EC2 `t2.micro` ($0/mo)

### Step 1: Launch your Free Tier EC2 Instance
1. Go to **AWS EC2 Console** → **Launch Instance**.
2. **Name:** `ResearchMind-FreeTier`
3. **AMI:** Ubuntu 22.04 LTS (64-bit x86)
4. **Instance Type:** `t2.micro` *(Free Tier eligible)*
5. **Key Pair:** Create or select an existing SSH key pair.
6. **Network Settings (Security Group):**
   - Check **Allow SSH traffic** (Port 22)
   - Check **Allow HTTP traffic** (Port 80)
   - Check **Allow HTTPS traffic** (Port 443)
7. **Storage:** 20 GB gp3 *(Up to 30 GB is free)*
8. Click **Launch Instance**.

---

### Step 2: SSH into EC2 & Setup 2GB Swap Space (Crucial for 1GB RAM)

Connect to your EC2 instance via SSH:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

Run these commands to add 2GB swap memory so Docker builds run smoothly:
```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

### Step 3: Install Docker & Docker Compose
```bash
# Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker
```

---

### Step 4: Clone Code & Configure `.env`
```bash
git clone https://github.com/your-username/ResearchMindAI.git
cd ResearchMindAI

# Create root .env file
cat <<EOT > .env
AUTH_SECRET="$(openssl rand -hex 32)"
GOOGLE_API_KEY="your-gemini-api-key"
NEXTAUTH_URL="http://your-ec2-public-ip"
NEXT_PUBLIC_API_URL="http://your-ec2-public-ip:8000"
ALLOWED_ORIGINS="http://your-ec2-public-ip"
EOT
```

---

### Step 5: Start Docker Containers
```bash
docker compose up -d --build
```

Verify containers are healthy:
```bash
docker compose ps
```

---

## 🚀 Option B: Vercel (Frontend) + EC2 `t2.micro` (Backend) — Best Performance ($0/mo)

Because Next.js SSR performs best on Vercel's Edge Network, splitting the stack keeps your app ultra-fast while staying 100% free:

1. **Frontend on Vercel ($0/mo):**
   - Push your repo to GitHub.
   - Import to [Vercel](https://vercel.com). Root directory: `frontend`.
   - Set environment variables:
     - `NEXTAUTH_URL` = `https://your-app.vercel.app`
     - `AUTH_SECRET` = `same-hex-secret-as-backend`
     - `NEXT_PUBLIC_API_URL` = `http://your-ec2-public-ip:8000`

2. **Backend on EC2 `t2.micro` ($0/mo):**
   - Run only the backend container on EC2:
     ```bash
     cd ResearchMindAI/backend
     docker build -t backend .
     docker run -d -p 8000:8000 --env-file .env --name backend backend
     ```
