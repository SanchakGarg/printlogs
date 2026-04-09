#!/usr/bin/env bash
set -e

# ── Colours ───────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

info()    { echo -e "${CYAN}${BOLD}[•]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[✓]${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[!]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[✗]${RESET} $*"; exit 1; }

echo -e ""
echo -e "${BOLD}  3D Print Logger — Setup${RESET}"
echo -e "  ─────────────────────────"
echo -e ""

# ── 1. Check Docker ───────────────────────────────────────────────────────────
info "Checking Docker..."
docker info > /dev/null 2>&1 || error "Docker is not running. Start Docker Desktop and try again."
success "Docker is running."

# ── 2. Copy .env ──────────────────────────────────────────────────────────────
if [ -f ".env" ]; then
  warn ".env already exists — skipping copy."
else
  cp .env.example .env
  success "Copied .env.example → .env"
fi

# ── 3. Open .env in editor ────────────────────────────────────────────────────
info "Opening .env for editing — save and close to continue..."
sleep 1
EDITOR="${EDITOR:-${VISUAL:-nano}}"
# Fall back through common editors if the preferred one isn't found
if ! command -v "$EDITOR" > /dev/null 2>&1; then
  for e in nano vim vi; do
    if command -v "$e" > /dev/null 2>&1; then EDITOR="$e"; break; fi
  done
fi
"$EDITOR" .env
success ".env saved. Resuming setup..."
echo -e ""

# ── 4. Build & start ──────────────────────────────────────────────────────────
info "Building and starting containers..."
docker compose up --build -d

echo -e ""
success "Done! App is running at ${BOLD}http://localhost:$(grep APP_PORT .env | cut -d= -f2 | tr -d '[:space:]' || echo 3000)${RESET}"
echo -e ""
