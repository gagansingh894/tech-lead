import Link from 'next/link'

export default function TopicLayout({
                                        title,
                                        tag,
                                        children,
                                    }: {
    title: string
    tag: string
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link
                    href="/"
                    className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block transition-colors"
                >
                    ← Back to Tech Lead
                </Link>
                <div className="mb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            {tag}
          </span>
                </div>
                <h1 className="text-3xl font-bold mb-10 text-zinc-100">{title}</h1>
                <div className="prose prose-invert prose-zinc max-w-none">
                    {children}
                </div>
            </div>
        </div>
    )
}