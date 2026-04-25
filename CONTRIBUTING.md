# Contributing to PGMaster

We appreciate your interest in contributing to PGMaster! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- No harassment, discrimination, or abuse
- Constructive feedback only

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/pgmaster.git
cd pgmaster
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

### 3. Make Your Changes

Follow these guidelines:

**Backend:**
- Follow PEP 8 style guide
- Write docstrings for functions/classes
- Add tests for new features
- Update requirements.txt if adding dependencies

**Frontend:**
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Add tests for complex components

### 4. Testing

**Backend Tests:**
```bash
docker-compose exec backend pytest tests/ -v
```

**Frontend Tests:**
```bash
cd pgmaster-frontend
npm test
```

### 5. Commit Messages

Use clear, descriptive commit messages:
```
feat: Add room occupancy tracking
fix: Resolve payment calculation bug
docs: Update API documentation
style: Format code with prettier
test: Add tenant API tests
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub with:
- Clear title
- Description of changes
- References to related issues
- Screenshots for UI changes

## Development Workflow

### Backend Development

1. **Create migrations for model changes**
   ```bash
   docker-compose exec backend python manage.py makemigrations
   ```

2. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Test your changes**
   ```bash
   docker-compose exec backend pytest tests/test_apis.py::TestClass::test_method -v
   ```

### Frontend Development

1. **Start dev server**
   ```bash
   cd pgmaster-frontend
   npm run dev
   ```

2. **Run linter and formatter**
   ```bash
   npm run lint
   npm run format
   ```

3. **Test components**
   ```bash
   npm test -- --watch
   ```

## Coding Standards

### Backend (Python)
```python
# Use type hints
def create_room(request: Request, pg_id: int) -> Response:
    """Create a new room with automatic bed allocation."""
    pass

# Document complex logic
class PaymentViewSet(ViewSet):
    def generate_monthly_rent(self, request):
        """
        Generate monthly rent for all active tenants.
        
        Respects PG settings for rent due day and auto-generates
        payment records with proper amount calculations.
        """
        pass
```

### Frontend (TypeScript)
```typescript
// Define interfaces
interface RoomFormProps {
  onSubmit: (data: RoomData) => Promise<void>
  isLoading?: boolean
  initialData?: Partial<RoomData>
}

// Use custom hooks
const { data, isLoading } = useQuery({
  queryKey: ['rooms'],
  queryFn: () => roomsAPI.list(),
})
```

## File Naming Conventions

**Backend:**
- Models: `models.py`
- Serializers: `serializers.py`
- Views: `views.py`
- URLs: `urls.py`
- Tests: `test_*.py`

**Frontend:**
- Components: `PascalCase.tsx` (e.g., `RoomForm.tsx`)
- Hooks: `useHookName.ts` (e.g., `useAuth.ts`)
- Pages: `page.tsx` in route folders
- Utilities: `camelCase.ts` (e.g., `api-client.ts`)

## Documentation

- Document new features in README
- Add docstrings to functions
- Keep API documentation updated
- Add code comments for complex logic

## Pull Request Checklist

- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Commits are atomic and well-messaged
- [ ] Branch is up to date with main

## Reporting Issues

**Bug Reports:**
- Describe the bug clearly
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment details (OS, Python/Node version)

**Feature Requests:**
- Clear use case
- Why it's needed
- Proposed solution
- Alternative approaches

## Review Process

1. Maintainers review your PR
2. Address feedback and make updates
3. PR is merged once approved
4. Your contribution is published!

## Setting Up Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

## Need Help?

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers

---

**Thank you for contributing to PGMaster!** 🎉
