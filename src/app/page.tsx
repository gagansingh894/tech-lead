import Link from 'next/link'
import { topics } from '@/lib/registry'

export default function Home() {
    return (
        <main className="min-h-screen" style={{ background: '#161820' }}>
            <style>{`
        .topic-card {
          background: #1e2028;
          border: 1px solid #2a2d38;
          border-radius: 12px;
          padding: 24px;
          height: 100%;
          transition: border-color 0.2s, background 0.2s;
        }
        .topic-card:hover {
          background: #22252f;
          border-color: #3a3d4a;
        }
      `}</style>

            <div className="max-w-5xl mx-auto px-6 py-16">

                <div style={{ marginBottom: 56 }}>
                    <h1 style={{ fontSize: 42, fontWeight: 700, color: '#f1f3f5', letterSpacing: '-0.02em', marginBottom: 10 }}>
                        Tech Lead
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6 }}>
                        Knowledge Base — Learn, Apply, Teach
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {topics.map(topic => (
                        <Link key={topic.slug} href={`/topics/${topic.slug}`} style={{ textDecoration: 'none' }}>
                            <div className="topic-card">
                <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#10b981',
                    display: 'block', marginBottom: 12
                }}>
                  {topic.tag}
                </span>
                                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', marginBottom: 10, lineHeight: 1.4 }}>
                                    {topic.title}
                                </h2>
                                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
                                    {topic.description}
                                </p>
                                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 12, color: '#4b5563' }}>Explore →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #1e2028' }}>
                    <p style={{ fontSize: 12, color: '#374151', textAlign: 'center' }}>
                        {topics.length} topics · Tech Lead reference library
                    </p>
                </div>

            </div>
        </main>
    )
}