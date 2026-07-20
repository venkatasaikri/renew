import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

async function getPage(slug: string) {
  try {
    const res = await fetch(`http://backend:5000/api/content/${slug}`, {
      next: { revalidate: 60 } // Next.js App Router ISR
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (err) {
    // Fallback to localhost if not in docker
    try {
      const resFallback = await fetch(`http://localhost:5000/api/content/${slug}`, {
        next: { revalidate: 60 }
      });
      if (!resFallback.ok) {
        if (resFallback.status === 404) return null;
        throw new Error('Failed to fetch data');
      }
      return resFallback.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const page = await getPage(p.slug);
  if (!page) {
    return { title: 'Not Found' };
  }
  return {
    title: page.title,
    description: `View content for ${page.title}`,
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const page = await getPage(p.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="public-page">
      <header className="public-header">
        <div className="container">
          <Link href="/" className="logo">MyBrand CMS</Link>
          <nav>
            <Link href="/">Home</Link>
          </nav>
        </div>
      </header>

      <main className="container content-container">
        <h1 className="page-title">{page.title}</h1>
        
        <div className="blocks-renderer">
          {page.blocks?.map((block: any) => (
            <div key={block.id} className={`content-block block-${block.type}`}>
              {block.type === 'text' && <p>{block.content}</p>}
              {block.type === 'markdown' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
              {block.type === 'html' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
              {block.type === 'equation' && (
                <div className="equation-render">
                   {/* In a real app we'd use KaTeX or MathJax here */}
                   <code>{block.content}</code>
                </div>
              )}
              {block.type === 'list' && (
                <ul>
                  {block.content.split('\n').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <footer className="public-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} MyBrand CMS. Built as a Tech Interview Demo.</p>
        </div>
      </footer>
    </div>
  );
}
