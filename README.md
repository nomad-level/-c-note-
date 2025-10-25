# C/Note - Code Snippet Manager

A Django-based application for managing code snippets and notes with category filtering, image attachments, and OAuth authentication.

## Features

- 📝 Create, read, update, and delete code snippets/notes
- 🏷️ Organize notes by categories (Python, JavaScript, HTML, CSS, React, Django, Node.js, SQL, Git, General, Other)
- 🖼️ Attach images to notes
- 🌓 Dark/Light theme toggle
- 🔍 Filter notes by category
- 📌 "My Notes" filtering (cookie-based session tracking)
- 🔐 Email/password authentication
- 🔑 OAuth login with Google and GitHub
- 📱 Responsive Bootstrap 5 design

## Tech Stack

- **Backend**: Django 5.2.7
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: django-allauth
- **Frontend**: Bootstrap 5.3.0, Bootstrap Icons
- **Image Handling**: Pillow
- **Deployment**: Heroku with Gunicorn and Whitenoise

## Installation

### Prerequisites

- Python 3.11+
- pip
- virtualenv (recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd men-stack-crud-app-lab
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and set your SECRET_KEY
   ```

5. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (for admin access)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Main app: http://localhost:8000
   - Admin panel: http://localhost:8000/admin

## Configuration

### OAuth Setup (Optional)

To enable Google or GitHub OAuth:

1. Go to the admin panel at `/admin`
2. Navigate to **Sites** and ensure the domain is correct
3. Add a **Social Application**:
   - **Provider**: Choose Google or GitHub
   - **Name**: Google/GitHub
   - **Client ID**: Your OAuth client ID
   - **Secret key**: Your OAuth secret
   - **Sites**: Select your site

#### Google OAuth
- Get credentials at: https://console.cloud.google.com/apis/credentials
- Authorized redirect URIs: `http://localhost:8000/accounts/google/login/callback/`

#### GitHub OAuth
- Get credentials at: https://github.com/settings/developers
- Authorization callback URL: `http://localhost:8000/accounts/github/login/callback/`

### Email Configuration (Optional)

If you want email verification for signups, configure these in `.env`:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

Then in `settings.py`, set `ACCOUNT_EMAIL_VERIFICATION = "mandatory"`

## Usage

### Creating Notes

1. Click **"New Note"** in the navigation
2. Enter a title, select a category, and add your code/text
3. Optionally attach an image
4. Click **"Create Note"**

### Filtering Notes

- Use the **category dropdown** to filter by specific categories
- Click **"My Notes"** to see only your notes (based on cookie session)

### Theme Toggle

Click the **sun/moon icon** in the navigation to switch between light and dark themes. Your preference is saved in localStorage.

## Deployment to Heroku

1. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DJANGO_SETTINGS_MODULE=cnote.settings
   ```

3. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run migrations**
   ```bash
   heroku run python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   heroku run python manage.py createsuperuser
   ```

7. **Configure OAuth redirect URIs**
   - Update Google/GitHub OAuth settings with your Heroku URL
   - Example: `https://your-app-name.herokuapp.com/accounts/google/login/callback/`

## Project Structure

```
├── cnote/                  # Django project settings
│   ├── settings.py        # Main configuration
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI configuration
├── notes/                 # Notes app
│   ├── models.py          # Note model
│   ├── views.py           # View functions
│   ├── forms.py           # Note form
│   ├── urls.py            # App URLs
│   └── templatetags/      # Custom template tags
├── templates/             # HTML templates
│   ├── base.html          # Base template
│   ├── account/           # Auth templates
│   └── notes/             # Note templates
├── static/                # Static files (created by collectstatic)
├── media/                 # User uploaded files
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── Procfile              # Heroku configuration
└── runtime.txt           # Python version for Heroku
```

## License

This project is open source and available under the MIT License.

## Acknowledgments

- UI design inspired by [DevDesk](https://github.com/nomad-level/DevDesk)
- Built with [Django](https://www.djangoproject.com/) and [Bootstrap](https://getbootstrap.com/)
