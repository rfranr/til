import fs from "node:fs/promises";
import path from "node:path";

const TIL_DIR = path.resolve("content");
const files = [];

async function readDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await readDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const relativePath = path.relative(TIL_DIR, fullPath);
        files.push(relativePath);
    }
  }
}


const parseTags = (line) => {
  const tagRegex = /#(\w+)/g;
  const tags = [];
  let match;
  while ((match = tagRegex.exec(line))) {
    tags.push(match[1]);
  }
  return tags;
}

const parse = (raw) => {
  // crude front-matter parser (good enough for simple cases)
  const fm = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/m.exec(raw);
  if (!fm) return { data:{}, body:raw };
  const data = Object.fromEntries(
    fm[1]
      .split("\n")
      .filter(Boolean)
      .map(line => {
        const [k, ...rest] = line.split(":");
        const v = rest.join(":").trim();
        try {
          // allow tags: [a, b] or JSON strings
          if (k.trim() === "tags") {
            return [k.trim(), parseTags(v)];
          }

          return [k.trim(), JSON.parse(v)];
        } catch {
          return [k.trim(), v.replace(/^["']|["']$/g, "")];
        }
      })
  );
  return { data, body: fm[2].trim() };
};

// Read all markdown files in TIL_DIR
await readDir(TIL_DIR);

// Parse files and build index
const items = [];
for (const file of files) {
  const raw = await fs.readFile(path.join(TIL_DIR, file), "utf8");
  const { data, body } = parse(raw);
  const slug = file.replace(/\.md$/, "");
  items.push({
    slug,
    title: data.title || slug,
    date: data.date || null,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    url: `content/${file}`,             // works on Pages; adjust if needed
    excerpt: body?.slice(0, 240) || ""
  });
}

items.sort((a, b) => String(b.date).localeCompare(String(a.date)));

await fs.copyFile("app/src/index.html", "dist/index.html");
await fs.writeFile("dist/index.json", JSON.stringify(items, null, 2));
console.log(`Wrote dist/index.json with ${items.length} items`);
