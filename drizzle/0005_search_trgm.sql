-- Instant search: pg_trgm extension + GIN trigram indexes for fuzzy/prefix product search.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS products_name_trgm_idx
  ON products USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS products_short_description_trgm_idx
  ON products USING gin (short_description gin_trgm_ops);
