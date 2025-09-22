-- KitchenCanvas PostgreSQL schema
-- Safe to run multiple times (IF NOT EXISTS) to initialize RDS

-- Users for login
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    username    TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Uploaded recipes authored by users
CREATE TABLE IF NOT EXISTS recipes (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    ingredients  TEXT,
    steps        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

-- Liked recipes saved by users (Spoonacular recipe_id)
CREATE TABLE IF NOT EXISTS liked_recipes (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id     INTEGER NOT NULL,
    recipe_title  TEXT NOT NULL,
    recipe_image  TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_liked_recipes_user_id ON liked_recipes(user_id);
