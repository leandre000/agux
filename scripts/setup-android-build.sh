#!/usr/bin/env bash

set -euo pipefail

# Change to repo root regardless of where the script is invoked from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

# Defaults (can be overridden via env or flags)
KEYSTORE_PATH=${KEYSTORE_PATH:-"android/my-upload-key.jks"}
KEY_ALIAS=${KEY_ALIAS:-"upload"}
KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD:-"ChangeMe_StrongPass_123!"}
KEY_PASSWORD=${KEY_PASSWORD:-"ChangeMe_StrongPass_123!"}
DNAME=${DNAME:-"CN=Agura, OU=Mobile, O=Agura, L=Kigali, S=Kigali, C=RW"}
SKIP_BUILD=${SKIP_BUILD:-"false"}

echo "[1/6] Ensuring android directories exist"
mkdir -p "$(dirname "$KEYSTORE_PATH")"
mkdir -p android || true

echo "[2/6] Locating keytool"
KEYTOOL_BIN="keytool"
if [[ -n "${JAVA_HOME:-}" && -x "${JAVA_HOME}/bin/keytool" ]]; then
  KEYTOOL_BIN="${JAVA_HOME}/bin/keytool"
fi
if ! command -v "$KEYTOOL_BIN" >/dev/null 2>&1; then
  echo "ERROR: keytool not found. Ensure JAVA_HOME is set or keytool is in PATH." >&2
  exit 1
fi

echo "[3/6] Generating keystore if missing"
if [[ ! -f "$KEYSTORE_PATH" ]]; then
  "$KEYTOOL_BIN" -genkeypair -v \
    -storetype JKS \
    -keystore "$KEYSTORE_PATH" \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "$DNAME"
  echo "Keystore created at $KEYSTORE_PATH"
else
  echo "Keystore already exists at $KEYSTORE_PATH"
fi

echo "[4/6] Writing credentials.json (local EAS credentials)"
cat > credentials.json <<JSON
{
  "android": {
    "keystore": {
      "keystorePath": "${KEYSTORE_PATH}",
      "keystorePassword": "${KEYSTORE_PASSWORD}",
      "keyAlias": "${KEY_ALIAS}",
      "keyPassword": "${KEY_PASSWORD}"
    }
  }
}
JSON
echo "credentials.json written at $REPO_ROOT/credentials.json"

echo "[5/6] Verifying EAS CLI and EXPO_TOKEN"
npx --yes eas-cli@latest --version >/dev/null
if [[ -z "${EXPO_TOKEN:-}" ]]; then
  echo "WARNING: EXPO_TOKEN is not set. Set it for non-interactive builds (export EXPO_TOKEN=...)" >&2
fi

if [[ "$SKIP_BUILD" == "true" ]]; then
  echo "SKIP_BUILD=true; exiting before build."
  exit 0
fi

echo "[6/6] Starting internal Android APK build (preview)"
npx --yes eas build --platform android --profile preview --non-interactive

echo "Done. Use 'npx --yes eas build:list --platform android' to see status."


