import fs from "fs/promises";
import path from "path";

interface LearningStore {
  keywordCategoryMap: Record<string, string>;
  categoryHits: Record<string, number>;
}

const STORE_PATH = path.join(process.cwd(), "backend", "chat_learning_store.json");

const DEFAULT_STORE: LearningStore = {
  keywordCategoryMap: {},
  categoryHits: {},
};

async function readStore(): Promise<LearningStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as LearningStore;
    return {
      keywordCategoryMap: parsed.keywordCategoryMap ?? {},
      categoryHits: parsed.categoryHits ?? {},
    };
  } catch {
    return DEFAULT_STORE;
  }
}

async function writeStore(store: LearningStore): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function extractUsefulTokens(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3)
    .slice(0, 10);
}

export async function learnCategoryFromMessage(message: string, category: string): Promise<void> {
  const store = await readStore();
  const tokens = extractUsefulTokens(message);

  for (const token of tokens) {
    store.keywordCategoryMap[token] = category;
  }
  store.categoryHits[category] = (store.categoryHits[category] ?? 0) + 1;

  await writeStore(store);
}

export async function getLearnedCategoryHint(message: string): Promise<string | null> {
  const store = await readStore();
  const tokens = extractUsefulTokens(message);

  for (const token of tokens) {
    const learned = store.keywordCategoryMap[token];
    if (learned) return learned;
  }
  return null;
}
