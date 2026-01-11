# NST-SDC-Portal

**Tracks and visualizes GitHub activity of NST-SDC club members. Includes dashboards for commits, pull requests, issues, leaderboards, achievements, and repository analytics to help monitor contributions and foster collaboration across all club projects.**

## Features

- **Commit Dashboard:** See daily, weekly, and monthly commit activity by club members and across projects.
- **Pull Requests Tracking:** Monitor open/closed PRs, PR reviewers, and contribution patterns.
- **Issues Overview:** Visualize open/closed issues, assignees, and trending topics.
- **Leaderboards:** Highlight top contributors based on commits, PRs, issue resolution, and activity streaks.
- **Achievements:** Showcase milestone badges for individual and team accomplishments.
- **Repository Analytics:** Analyze project-level stats, growth trends, and participation quality.

## Project Structure

```
nstsdc-portal/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
├── server/              # Django backend
│   ├── manage.py
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── requirements.txt
│   └── config/
│       ├── __init__.py
│       ├── settings.py
│       ├── urls.py
│       └── wsgi.py
└── README.md
```

## Technologies Used

### Frontend
- **React** 19.1.1 - UI library
- **Vite** 7.1.7 - Build tool and dev server
- **ESLint** - Code linting

### Backend
- **Python** 3.11+ - Programming language
- **Django** 5.2.8 - Web framework
- **Django REST Framework** 3.16.1 - API toolkit
- **uv** - Python package manager
- **Pillow** - Image processing

### Development Tools
- **Ruff** (optional) - Python linting and formatting

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11 or higher
- [uv](https://github.com/astral-sh/uv) (recommended for Python dependency management)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nst-sdc/NST-SDC-Portal.git
   cd NST-SDC-Portal
   ```

2. **Install Dependencies**

   **Server (Python/Django):**
   ```bash
   cd server
   # using uv (recommended)
   uv sync
   
   # OR using pip
   python -m pip install -r requirements.txt
   ```

   **Client (React/Vite):**
   ```bash
   cd ../client
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `server` directory:
   ```env
   # Django Settings
   DEBUG=True
   SECRET_KEY=your_secret_key
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Database (if using Postgres, otherwise defaults to SQLite)
   # DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   # using uv
   uv run python manage.py runserver
   
   # OR using standard python
   python manage.py runserver
   ```
   Server will run on http://localhost:8000

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

## Development

### Frontend Development
- The client uses Vite with React and Hot Module Replacement (HMR)
- Edit files in `client/src/` and changes will reflect immediately

### Backend Development
- The server is built with Django and Django REST Framework
- Changes to Python files will auto-reload the server
- Run migrations: `uv run python manage.py migrate`
- Create superuser: `uv run python manage.py createsuperuser`

## Basic Flow Diagram

```
User                   Server/API                    Admin
 |                        |                           |
 |---Login via GitHub---->| OAuth callback            |
 |<---JWT/Session Auth----|                           |
 |----Profile Form------->| Save user profile         |
 |<--Dashboard Data-------| Fetch GH & DB             |
 |                        |                           |
                                  |-----Admin login-->|
                                  |<--User/list data--|
                                  |---User details--->|
```

## Usage

- **Dashboards** – Real-time visualizations of contribution statistics
- **Admin Panel** – Manage member list, add new projects, and customize achievements
- **Analytics Export** – Download CSV or PDF reports for club meetings or reviews

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License.

---

**Repository:** [nst-sdc/NST-SDC-Portal](https://github.com/nst-sdc/NST-SDC-Portal)
