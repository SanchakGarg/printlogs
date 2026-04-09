#!/usr/bin/env bash
set -e

# ── Colours ───────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

info()    { echo -e "${CYAN}${BOLD}[•]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[✓]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[✗]${RESET} $*"; exit 1; }

echo -e ""
echo -e "${BOLD}  3D Print Logger — Update${RESET}"
echo -e "  ──────────────────────────"
echo -e ""

# ── 1. Check Docker ───────────────────────────────────────────────────────────
info "Checking Docker..."
docker info > /dev/null 2>&1 || error "Docker is not running. Start Docker Desktop and try again."
success "Docker is running."

# ── 2. Pull latest code ───────────────────────────────────────────────────────
info "Pulling latest code from git..."
git pull
success "Git up to date."

# ── 3. Rebuild & restart ──────────────────────────────────────────────────────
info "Rebuilding and restarting containers..."
docker compose up --build -d

echo -e ""
success "Update complete! App is running at ${BOLD}http://localhost:$(grep APP_PORT .env | cut -d= -f2 | tr -d '[:space:]' || echo 3000)${RESET}"
echo -e ""
