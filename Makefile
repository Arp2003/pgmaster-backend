# PGMaster Makefile - Development & Deployment Commands

.PHONY: help setup install-deps migrate run test lint format clean stop logs build deploy

help:
	@echo "🏗️  PGMaster Development Commands"
	@echo "=================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup              - Initial project setup"
	@echo "  make install-deps       - Install all dependencies"
	@echo ""
	@echo "Database:"
	@echo "  make migrate            - Run database migrations"
	@echo "  make makemigrations     - Create migration files"
	@echo "  make createsuperuser    - Create admin user"
	@echo ""
	@echo "Running:"
	@echo "  make run                - Start all services"
	@echo "  make backend            - Start backend only"
	@echo "  make frontend           - Start frontend only"
	@echo ""
	@echo "Testing:"
	@echo "  make test               - Run all tests"
	@echo "  make test-backend       - Run backend tests"
	@echo "  make test-frontend      - Run frontend tests"
	@echo "  make test-coverage      - Generate coverage report"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint               - Lint code"
	@echo "  make format             - Format code"
	@echo "  make type-check         - Type checking"
	@echo ""
	@echo "Docker:"
	@echo "  make build              - Build Docker images"
	@echo "  make stop               - Stop all services"
	@echo "  make logs               - View service logs"
	@echo "  make clean              - Clean up containers & volumes"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy             - Deploy to production"
	@echo "  make deploy-local       - Deploy locally"
	@echo ""

# Setup & Installation
setup:
	@echo "🚀 Setting up PGMaster..."
	cp pgmaster-backend/.env.example pgmaster-backend/.env
	cp pgmaster-frontend/.env.local.example pgmaster-frontend/.env.local || true
	@echo "✅ Setup complete! Edit .env files as needed."

install-deps:
	@echo "📦 Installing dependencies..."
	docker-compose build
	@echo "✅ Dependencies installed!"

# Database Commands
migrate:
	@echo "🔄 Running migrations..."
	docker-compose exec -T backend python manage.py migrate
	@echo "✅ Migrations complete!"

makemigrations:
	@echo "📝 Creating migrations..."
	docker-compose exec backend python manage.py makemigrations
	@echo "✅ Migrations created!"

createsuperuser:
	@echo "👤 Creating superuser..."
	docker-compose exec backend python manage.py createsuperuser
	@echo "✅ Superuser created!"

# Running Services
run:
	@echo "🏃 Starting all services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   Backend:   http://localhost:8000"
	@echo "   Admin:     http://localhost:8000/admin"

backend:
	@echo "🏃 Starting backend..."
	cd pgmaster-backend && python manage.py runserver 0.0.0.0:8000

frontend:
	@echo "🏃 Starting frontend..."
	cd pgmaster-frontend && npm run dev

# Testing
test:
	@echo "🧪 Running all tests..."
	docker-compose exec -T backend pytest tests/ -v
	@echo "✅ Tests complete!"

test-backend:
	@echo "🧪 Running backend tests..."
	docker-compose exec -T backend pytest tests/test_apis.py -v

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd pgmaster-frontend && npm test

test-coverage:
	@echo "📊 Generating coverage report..."
	docker-compose exec -T backend pytest tests/ --cov=apps --cov-report=html
	@echo "✅ Report generated in htmlcov/index.html"

# Code Quality
lint:
	@echo "🔍 Linting code..."
	docker-compose exec backend flake8 apps/
	cd pgmaster-frontend && npm run lint
	@echo "✅ Linting complete!"

format:
	@echo "📐 Formatting code..."
	docker-compose exec backend black apps/
	cd pgmaster-frontend && npm run format
	@echo "✅ Formatting complete!"

type-check:
	@echo "📌 Type checking..."
	cd pgmaster-frontend && npx tsc --noEmit
	@echo "✅ Type checking complete!"

# Docker Commands
build:
	@echo "🐳 Building Docker images..."
	docker-compose build
	@echo "✅ Images built!"

stop:
	@echo "🛑 Stopping services..."
	docker-compose stop
	@echo "✅ Services stopped!"

logs:
	@echo "📋 Viewing logs..."
	docker-compose logs -f

logs-backend:
	@echo "📋 Viewing backend logs..."
	docker-compose logs -f backend

logs-frontend:
	@echo "📋 Viewing frontend logs..."
	docker-compose logs -f frontend

clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name '*.pyc' -delete
	@echo "✅ Cleanup complete!"

# Deployment
deploy-local:
	@echo "🚀 Deploying locally..."
	$(MAKE) clean
	$(MAKE) setup
	$(MAKE) install-deps
	$(MAKE) run
	$(MAKE) migrate
	@echo "✅ Local deployment complete!"

deploy:
	@echo "🚀 Deploying to production..."
	@echo "Please configure production settings in .env"
	@echo "Run: docker-compose -f docker-compose.prod.yml up -d"
	@echo "Then run: docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate"

# Development Utilities
shell-backend:
	@echo "🐚 Opening Django shell..."
	docker-compose exec backend python manage.py shell

shell-db:
	@echo "🐚 Opening database shell..."
	docker-compose exec db psql -U pgmaster -d pgmaster

requirements-freeze:
	@echo "📋 Freezing requirements..."
	docker-compose exec backend pip freeze > pgmaster-backend/requirements.txt
	@echo "✅ Requirements frozen!"

# Fresh Start
fresh:
	@echo "🔄 Fresh start..."
	$(MAKE) clean
	$(MAKE) setup
	$(MAKE) install-deps
	$(MAKE) run
	$(MAKE) migrate
	@echo "✅ Fresh start complete!"
