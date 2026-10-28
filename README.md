# Box Office Estimator

Enter a movie title and Thursday preview gross in US dollars. The backend
multiplies the preview gross by a fixed 8 and returns the estimated weekend box
office, rounded to the nearest dollar. This is a baseline calculation, not a
trained prediction model. No movie API or API key is needed.

## Run locally

Requires Python 3.9 or later. From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Open [localhost:8000](http://localhost:8000). The backend serves both the API and
the frontend. Styling uses the Tailwind CSS CDN and requires an internet connection.

## API

`POST /api/predict`

Request:

```json
{"movie_title": "Dune: Part Two", "preview_gross": 12000000}
```

Response:

```json
{
  "movie_title": "Dune: Part Two",
  "preview_gross": 12000000,
  "estimated_weekend_box_office": 96000000
}
```

Movie titles are trimmed and must contain 1–200 characters. Preview gross must
be positive and finite. The multiplier is always 8 and cannot be customized.

Interactive API documentation: [localhost:8000/docs](http://localhost:8000/docs).

## Deployment on Render

- Build command: `pip install -r backend/requirements.txt`
- Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

Run commands from the project root. No application environment variables are required.

## Project layout

```text
backend/
  __init__.py
  main.py
  requirements.txt
frontend/
  css/style.css
  js/app.js
  index.html
.gitignore
README.md
```
