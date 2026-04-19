import { notFound } from 'next/navigation'
import { getTopicBySlug, topics } from '@/lib/registry'
import BackButton from '@/components/BackButton'

export function generateStaticParams() {
    return topics.map(t => ({ slug: t.slug }))
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const topic = getTopicBySlug(slug)
    if (!topic) notFound()

    const Component = topic.component
    return (
        <>
            <BackButton />
            <Component />
        </>
    )
}