#!/usr/bin/env bash
# Builds the web demos, installs the mobile wrapper, and starts Expo.
# Scan the QR code that appears at the end with Expo Go on your phone.

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() { printf "${BLUE}==>${NC} %s\n" "$*"; }
ok()   { printf "${GREEN}OK${NC}  %s\n" "$*"; }
warn() { printf "${YELLOW}!${NC}   %s\n" "$*"; }
err()  { printf "${RED}X${NC}   %s\n" "$*" >&2; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

info "Checking prerequisites..."
if ! command -v node >/dev/null 2>&1; then
  err "Node.js is not installed. Get it from https://nodejs.org (LTS version is fine)."
  exit 1
fi
NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  err "Node $NODE_MAJOR is too old. Please install Node 18 or newer."
  exit 1
fi
ok "Node $(node --version)"

if [ ! -d "node_modules" ]; then
  info "Installing web app dependencies (first run only, ~30s)..."
  npm install
else
  ok "Web app dependencies already installed"
fi

info "Building web demos into a single self-contained HTML file..."
npm run build
ok "Built dist/index.html"

cd mobile
FRESH_MOBILE_INSTALL=0
if [ ! -d "node_modules" ]; then
  FRESH_MOBILE_INSTALL=1
  info "Installing mobile app dependencies (first run only, ~1-2 min)..."
  npm install
  info "Aligning Expo version pins with your Expo Go app..."
  npx expo install --fix
else
  ok "Mobile app dependencies already installed"
fi

cat <<EOF

${GREEN}Ready to run.${NC}

  1. On your phone, install ${YELLOW}Expo Go${NC}:
       iOS:     https://apps.apple.com/app/expo-go/id982107779
       Android: https://play.google.com/store/apps/details?id=host.exp.exponent

  2. Connect your phone and this computer to the ${YELLOW}same WiFi network${NC}.

  3. A QR code will appear below. Scan it:
       iOS:     with the Camera app
       Android: with the Expo Go app

  The demos run offline inside Expo Go once loaded.
  Press Ctrl+C to stop the server.

EOF

npm run bundle-html && npx expo start --clear
