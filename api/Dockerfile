FROM python:3.14.9-slim-bookworm AS builder

ARG SERVICE
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true

RUN python -m pip install --no-cache-dir poetry==2.5.1

WORKDIR /app
COPY common ./common
COPY services/${SERVICE}/pyproject.toml services/${SERVICE}/poetry.lock ./services/${SERVICE}/
WORKDIR /app/services/${SERVICE}
RUN poetry install --only main --no-ansi

FROM python:3.14.9-slim-bookworm AS runtime

ARG SERVICE
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/services/${SERVICE}/.venv/bin:${PATH}"

RUN useradd --uid 10001 --create-home app

WORKDIR /app/services/${SERVICE}
COPY --from=builder /app/common /app/common
COPY --from=builder /app/services/${SERVICE}/.venv ./.venv
COPY services/${SERVICE}/ ./

USER app
EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
    CMD ["python", "-c", "from urllib.request import urlopen; urlopen('http://127.0.0.1:5000/health', timeout=2).close()"]

# Each worker creates the application and MongoClient after the fork.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "--access-logfile", "-", "--error-logfile", "-", "app:create_app()"]
