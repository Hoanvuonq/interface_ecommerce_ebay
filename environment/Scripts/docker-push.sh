#!/bin/bash
# Bash script to build, tag and push Frontend image to Docker Hub
# Usage: ./docker-push.sh [dev|staging|prod] [tag]
# Example: ./docker-push.sh prod latest

set -e

# Default values
ENVIRONMENT="${1:-prod}"
TAG="${2:-latest}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "Error: Environment must be one of: dev, staging, prod"
    exit 1
fi

# Get script directory and navigate to environment directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ENV_DIR"

COMPOSE_FILE="compose/docker-compose.$ENVIRONMENT.yml"
DOCKERHUB_USER="quy123zz"
DOCKERHUB_REPO="ebay_ecom"

echo "==============================="
echo " Frontend Docker Build & Push"
echo "==============================="
echo " Environment: $ENVIRONMENT"
echo " Tag: $TAG"
echo " Repository: $DOCKERHUB_USER/$DOCKERHUB_REPO"
echo ""

# Build image
echo "[1/3] Building image..."
docker compose -f "$COMPOSE_FILE" build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!" >&2
    exit 1
fi

# Get image ID
echo "[2/3] Detecting image ID..."
# Try to get image ID from docker compose images first (if containers exist)
IMAGE_ID=$(docker compose -f "$COMPOSE_FILE" images --quiet nextjs-frontend 2>/dev/null | grep -E '^[a-f0-9]{12,64}$' | head -n 1 | tr -d '\n')

# If not found, try to find by image name pattern (compose-<service-name>)
if [ -z "$IMAGE_ID" ]; then
    # Get the directory name to construct image name (e.g., compose-nextjs-frontend)
    COMPOSE_DIR=$(basename "$(dirname "$COMPOSE_FILE")")
    IMAGE_NAME_PATTERN="${COMPOSE_DIR}-nextjs-frontend"
    IMAGE_ID=$(docker images --format "{{.ID}}" --filter "reference=${IMAGE_NAME_PATTERN}:latest" 2>/dev/null | head -n 1 | tr -d '\n')
fi

# If still not found, try to find any image with nextjs-frontend in name
if [ -z "$IMAGE_ID" ]; then
    IMAGE_ID=$(docker images --format "{{.ID}}" --filter "reference=*nextjs-frontend*" 2>/dev/null | head -n 1 | tr -d '\n')
fi

if [ -z "$IMAGE_ID" ]; then
    echo "ERROR: Image ID not found!" >&2
    echo "Tried: docker compose images, compose-*nextjs-frontend*, *nextjs-frontend*" >&2
    echo "Available images:" >&2
    docker images | grep -E "nextjs|frontend|compose" | head -5 >&2
    exit 1
fi

echo " Image ID: $IMAGE_ID"
echo ""

# Tag and push
echo "[3/3] Tagging and pushing..."
FRONTEND_TAG="$DOCKERHUB_USER/${DOCKERHUB_REPO}:frontend-$TAG"

echo " Tagging: $FRONTEND_TAG"
docker tag "$IMAGE_ID" "$FRONTEND_TAG"
if [ $? -ne 0 ]; then
    echo "ERROR: Tagging failed!" >&2
    exit 1
fi

echo " Docker login..."
docker login
if [ $? -ne 0 ]; then
    echo "ERROR: Login failed!" >&2
    exit 1
fi

echo " Pushing: $FRONTEND_TAG"
docker push "$FRONTEND_TAG"
if [ $? -ne 0 ]; then
    echo "ERROR: Push failed!" >&2
    exit 1
fi

echo ""
echo "==============================="
echo " PUSH COMPLETED!"
echo "==============================="
echo " Image: $FRONTEND_TAG"
echo ""

