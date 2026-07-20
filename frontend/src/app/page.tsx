import Link from 'next/link';

async function getPages() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/content`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const pages = await getPages();

  return (
    <div className="public-page">
      <header className="public-header">
        <div className="container">
          <Link href="/" className="logo">MyBrand CMS</Link>
          <nav>
            <Link href="/admin">Admin Panel</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Welcome to the Modern CMS</h1>
          <p>This is a headless CMS architecture built with Next.js App Router and Express.</p>
        </section>

        <section className="pages-directory">
          <h2>Available Pages</h2>
          <div className="grid">
            {pages.map((page: any) => (
              <Link href={`/${page.slug}`} key={page._id} className="card-link">
                <h3>{page.title}</h3>
                <p>Read more &rarr;</p>
              </Link>
            ))}
            {pages.length === 0 && (
              <p>No pages found. Go to the Admin Panel to create some!</p>
            )}
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} MyBrand CMS. Built as a Tech Interview Demo.</p>
        </div>
      </footer>
    </div>
  );
}
