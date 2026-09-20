#!/bin/sh
set -e

RELEASE_TAG="${RELEASE_TAG:-latest}"
GITHUB_REPO="${GITHUB_REPO:-youruser/yourproject}"
DIST_NAME="${DIST_NAME:-landing.zip}"

DIST_URL="https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/${DIST_NAME}"


echo "Downloading dist from ${DIST_URL}"
gh --version
echo "${GITHUB_AUTH_TOKEN}" | gh auth login --with-token --hostname github.com
gh release download ${RELEASE_TAG} --repo ${GITHUB_REPO} --pattern ${DIST_NAME} -D /tmp
unzip -o /tmp/${DIST_NAME} -d /usr/share/nginx/html

rm /tmp/*.zip

echo "Starting nginx"
exec nginx -g 'daemon off;'