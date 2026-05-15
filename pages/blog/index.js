import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { SiteNav, SiteFooter } from "../../components/Layout";

export async function getStaticProps() {
  const postsDir = path.join(process.cwd(), "data", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
    const { data, content } = matter(raw);
    const slug = filename.replace(".md", "");
    const lines = content.split("\n").filter((l) => l.trim().length > 30 && !l.startsWith("#") && !l.startsWith("!") && !l.startsWith("*"));
    const excerpt = lines.slice(0, 2).join(" ").replace(/\*\*/g, "").slice(0, 160) + "...";
    return { slug, title: data.title || slug, date: data.date || "", excerpt };
  });
  return { props: { posts } };
}

export default function BlogIndex({ posts }) {
  return (
    <>
      <SiteNav />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Songwriter Resources & Rhyming Guides
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>Tips, guides, and rhyming resources for songwriters and rappers.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {posts.map((post) => (
            <div key={post.slug} style={{ borderBottom: "1px solid #eee", paddingBottom: "1.5rem" }}>
              <Link href={`/blog/${post.slug}`} style={{ fontSize: "1.3rem", fontWeight: "700", color: "#1a1a1a", textDecoration: "none" }}>
                {post.title}
              </Link>
              <p style={{ fontSize: "0.85rem", color: "#999", margin: "0.25rem 0 0.5rem" }}>{post.date}</p>
              <p style={{ color: "#555", lineHeight: "1.7" }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} style={{ color: "#6366f1", fontSize: "0.9rem", textDecoration: "none", fontWeight: "600" }}>
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}