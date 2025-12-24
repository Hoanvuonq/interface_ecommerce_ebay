#!/bin/bash
# Bash script to build and run Docker Compose for Frontend
# Usage: ./docker-build.sh [dev|staging|prod] [up|build|down|...]
# Example: ./docker-build.sh dev up --build

set -e

# Default values
ENVIRONMENT="${1:-dev}"
shift || true
DOCKER_COMPOSE_ARGS="${@:-up --build}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod|test)$ ]]; then
    echo "Error: Environment must be one of: dev, staging, prod, test"
    exit 1
fi

# Get script directory and navigate to environment directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ENV_DIR"

COMPOSE_FILE="compose/docker-compose.$ENVIRONMENT.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: Compose file not found: $COMPOSE_FILE" >&2
    exit 1
fi

echo "==============================="
echo " Frontend Docker Compose"
echo "==============================="
echo " Environment: $ENVIRONMENT"
echo " Compose file: $COMPOSE_FILE"
echo ""

docker compose -f "$COMPOSE_FILE" $DOCKER_COMPOSE_ARGS

