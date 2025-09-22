-- Conditionally add missing columns to liked_recipes
DO $$
BEGIN
  -- Add recipe_title if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'liked_recipes' AND column_name = 'recipe_title'
  ) THEN
    ALTER TABLE public.liked_recipes ADD COLUMN recipe_title TEXT;
  END IF;

  -- Add recipe_image if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'liked_recipes' AND column_name = 'recipe_image'
  ) THEN
    ALTER TABLE public.liked_recipes ADD COLUMN recipe_image TEXT;
  END IF;

  -- Ensure unique constraint on (user_id, recipe_id)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'liked_recipes_user_recipe_unique'
  ) THEN
    ALTER TABLE public.liked_recipes
      ADD CONSTRAINT liked_recipes_user_recipe_unique UNIQUE (user_id, recipe_id);
  END IF;
END
$$;
