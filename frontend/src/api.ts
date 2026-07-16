const API_BASE =
  import.meta.env.VITE_API_URL ?? "https://api.helios.shishirkhatri.com.np/api";

export interface PaperListItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paper extends PaperListItem {
  content: string;
}

export interface ModelListItem {
  slug: string;
  name: string;
  tagline: string;
  card_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Model extends ModelListItem {
  description: string;
  content: string;
  banner_image_url?: string | null;
  parameters?: string | null;
  context_length?: string | null;
  base_model?: string | null;
  required_hardware?: string | null;
  huggingface_url?: string | null;
  github_url?: string | null;
}

export async function fetchPapers(category: string): Promise<PaperListItem[]> {
  const res = await fetch(
    `${API_BASE}/helios/papers?category=${encodeURIComponent(category)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.papers ?? [];
}

export async function fetchModels(): Promise<ModelListItem[]> {
  const res = await fetch(`${API_BASE}/helios/models`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.models ?? [];
}

export async function fetchModel(slug: string): Promise<Model> {
  const res = await fetch(
    `${API_BASE}/helios/models/${encodeURIComponent(slug)}`,
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found");
    throw new Error("Failed to fetch");
  }
  const data = await res.json();
  return data.model;
}

export async function fetchPaper(slug: string): Promise<Paper> {
  const res = await fetch(
    `${API_BASE}/helios/papers/${encodeURIComponent(slug)}`,
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found");
    throw new Error("Failed to fetch");
  }
  const data = await res.json();
  return data.paper;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
