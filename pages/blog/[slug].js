import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { SiteNav, SiteFooter } from "../../components/Layout";

export async function getStaticPaths() {
  const postsDir = path.join(process.cwd(), "data", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return {
    paths: files.map((f) => ({ params: { slug: f.replace(".md", "") } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "data", "posts", `${params.slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    props: {
      title: data.title || params.slug,
      date: data.date || "",
      content,
    },
  };
}

export default function BlogPost({ title, date, content }) {
  return (
    <>
      <SiteNav />
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" }}>
        <a href="/blog" style={{ color: "#6366f1", fontSize: "0.9rem", textDecoration: "none" }}>← Back to Blog</a>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: "700", margin: "1rem 0 0.5rem", lineHeight: "1.3" }}>{title}</h1>
        <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "2rem" }}>{date}</p>
        <div style={{ fontSize: "1rem", lineHeight: "1.9", color: "#e5e5e5" }}>
          <ReactMarkdown
            components={{
              h2: ({children}) => <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginTop: "2rem", marginBottom: "0.75rem" }}>{children}</h2>,
              h3: ({children}) => <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "1.5rem", marginBottom: "0.5rem" }}>{children}</h3>,
              p: ({children}) => <p style={{ marginBottom: "1.25rem" }}>{children}</p>,
              a: ({href, children}) => <a href={href} style={{ color: "#6366f1" }}>{children}</a>,
              img: ({src, alt}) => <img src={src} alt={alt} style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#f5f3ff", borderRadius: "12px", textAlign: "center" }}>
          <p style={{ fontWeight: "700", marginBottom: "0.75rem" }}>Find the perfect rhyme for your next song</p>
          <a href="/" style={{ display: "inline-block", background: "#6366f1", color: "white", padding: "0.75rem 1.5rem", borderRadius: "25px", textDecoration: "none", fontWeight: "600" }}>
            Try RhymeItNow →
          </a>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}