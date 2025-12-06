#!/bin/bash

echo "🚀 Setting up AI Document Summarizer..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your OpenRouter API key!"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL & MinIO)..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your .env file with your OpenRouter API key"
echo "   2. Run: npm run start:dev"
echo "   3. Visit: http://localhost:3000/api for Swagger UI"
echo ""
echo "🔗 Service URLs:"
echo "   - API: http://localhost:3000"
echo "   - Swagger: http://localhost:3000/api"
echo "   - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo ""
