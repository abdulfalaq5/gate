# Contributing to Express Boilerplate

Terima kasih telah mempertimbangkan untuk berkontribusi pada Express Boilerplate! Kami menyambut baik kontribusi dari komunitas.

## Cara Berkontribusi

### 1. Fork Repository

1. Fork repository ini ke akun GitHub Anda
2. Clone repository yang sudah di-fork ke local machine Anda

```bash
git clone https://github.com/your-username/express-boilerplate.git
cd express-boilerplate
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment file
cp environment.example .env

# Setup database (sesuaikan dengan konfigurasi Anda)
npm run migrate
```

### 3. Membuat Branch

Buat branch baru untuk fitur atau bug fix Anda:

```bash
git checkout -b feature/amazing-feature
# atau
git checkout -b fix/bug-description
```

### 4. Development Guidelines

#### Code Style

- Gunakan ESLint yang sudah dikonfigurasi
- Ikuti naming convention yang sudah ditetapkan:
  - Variables: `camelCase`
  - Constants: `UPPER_CASE`
  - Classes: `PascalCase`
  - Files: `snake_case`
  - Functions: Verb (getUser, createUser)
  - Variables: Noun (userData, userList)

#### Commit Messages

Gunakan format commit message yang jelas:

```
type(scope): description

feat(auth): add password reset functionality
fix(validation): correct email validation regex
docs(readme): update installation instructions
refactor(utils): simplify date formatting function
test(auth): add unit tests for login function
```

Types yang tersedia:
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Dokumentasi
- `style`: Formatting, semicolons, dll
- `refactor`: Refactoring code
- `test`: Menambah atau memperbaiki tests
- `chore`: Maintenance tasks

#### Testing

- Pastikan semua test passing
- Tambahkan test untuk fitur baru
- Update test untuk bug fixes

### 5. Pull Request Process

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(auth): add password reset functionality"
   ```

2. **Push ke Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

3. **Buat Pull Request**
   - Buka GitHub dan buat Pull Request
   - Isi template PR dengan lengkap
   - Jelaskan perubahan yang dibuat
   - Link ke issue terkait (jika ada)

### 6. PR Template

Gunakan template berikut untuk Pull Request:

```markdown
## Description
Jelaskan perubahan yang dibuat dalam PR ini.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Test cases added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or clearly documented)
```

## Reporting Issues

### Bug Reports

Gunakan template berikut untuk melaporkan bug:

```markdown
**Describe the bug**
Deskripsi yang jelas dan ringkas tentang bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
Deskripsi yang jelas tentang apa yang diharapkan terjadi.

**Screenshots**
Jika applicable, tambahkan screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Node.js version: [e.g. 16.14.0]
 - Database: [e.g. PostgreSQL 13]

**Additional context**
Tambahkan konteks lain tentang masalah ini.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
Deskripsi yang jelas tentang masalah yang ingin diselesaikan.

**Describe the solution you'd like**
Deskripsi yang jelas tentang solusi yang diinginkan.

**Describe alternatives you've considered**
Deskripsi alternatif solusi yang sudah dipertimbangkan.

**Additional context**
Tambahkan konteks lain tentang feature request ini.
```

## Code Review Process

### Untuk Contributors

1. Pastikan PR Anda sudah siap untuk review
2. Respond dengan cepat terhadap feedback
3. Update PR berdasarkan review comments
4. Pastikan semua CI checks passing

### Untuk Maintainers

1. Review PR dalam waktu yang wajar
2. Berikan feedback yang konstruktif
3. Approve PR yang sudah memenuhi standar
4. Merge PR setelah semua requirements terpenuhi

## Development Setup

### Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- Redis (opsional)
- RabbitMQ (opsional)

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp environment.example .env
# Edit .env sesuai kebutuhan

# Setup database
npm run migrate

# Start development server
npm run dev
```

### Docker Development

```bash
# Start with Docker
docker-compose -f docker-compose.dev.yml up --build

# Run migrations in container
docker-compose -f docker-compose.dev.yml exec app npm run migrate
```

## Community Guidelines

### Code of Conduct

Kami berkomitmen untuk menyediakan lingkungan yang ramah dan inklusif untuk semua contributors. Harap:

- Gunakan bahasa yang sopan dan konstruktif
- Hormati perbedaan pendapat dan pengalaman
- Fokus pada apa yang terbaik untuk komunitas
- Tunjukkan empati terhadap anggota komunitas lain

### Getting Help

- **Documentation**: Baca README.md dan MODULE_GUIDE.md
- **Issues**: Cari di GitHub Issues untuk masalah yang sudah pernah dilaporkan
- **Discussions**: Gunakan GitHub Discussions untuk pertanyaan umum
- **Discord/Slack**: Jika ada, join komunitas chat

## Recognition

Contributors akan diakui dalam:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

Terima kasih atas kontribusi Anda! 🎉
