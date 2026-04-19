import { ComponentType } from 'react';

export type Topic = {
    slug: string
    title: string
    description: string
    tag: string
    component: ComponentType
}

import AsyncConcurrency from '@/topics/async-concurrency-parallelism'
import LayeredArchitecture from '@/topics/layered-architecture'
import SpringBootAnnotations from '@/topics/spring-boot-annotations'
import LlmMetricsRouting from "@/topics/llm-metrics-routing";
import EventSourcingCQRS from "@/topics/event-sourcing-cqrs";
import LlmEvaluationMetrics from "@/topics/llm-evaluation-metrics";
import MemoryLockfreeConcurrency from "@/topics/memory-lockfree-concurrency";
import DSAReference from "@/topics/dsa-reference";

export const topics: Topic[] = [
    {
        slug: 'async-concurrency',
        title: 'Async, Concurrency & Parallelism',
        description: 'Threads, coroutines, event loops and when to use each.',
        tag: 'Concurrency',
        component: AsyncConcurrency,
    },
    {
        slug: 'layered-architecture',
        title: 'Layered Architecture',
        description: 'Controllers, services, repositories and clean separation.',
        tag: 'Architecture',
        component: LayeredArchitecture,
    },
    {
        slug: 'spring-boot-annotations',
        title: 'Spring Boot Annotations',
        description: 'The annotations that wire a Spring app together.',
        tag: 'Java',
        component: SpringBootAnnotations,
    },
    {
        slug: 'llm-metrics',
        title: 'LLM Metrics & Routing',
        description: 'Latency, cost, quality tradeoffs and how to route between models.',
        tag: 'AI/ML',
        component: LlmMetricsRouting,
    },
    {
        slug: 'event-sourcing',
        title: 'Event Sourcing & CQRS',
        description: 'Append-only logs, projections, and separating reads from writes.',
        tag: 'Distributed Systems',
        component: EventSourcingCQRS,
    },
    {
        slug: 'llm-evaluation-metrics',
        title: 'LLM Evaluation Metrics',
        description: "Common metrics for evaluating LLM",
        tag: 'AI/ML',
        component: LlmEvaluationMetrics,
    },
    {
        slug: 'memory-lockfree-concurrency',
        title: 'Lock-free Concurrency',
        description: 'Understand memory pressure and lock free data strcutres for concurrecy',
        tag: 'Concurrency',
        component: MemoryLockfreeConcurrency,
    },
    {
        slug: 'dsa-reference',
        title: 'Data Structures & Algorithms',
        description: 'DSA reference across multiple languages',
        tag: 'Computer Science',
        component: DSAReference,
    }
]

export function getTopicBySlug(slug: string): Topic | undefined {
    return topics.find(t => t.slug === slug)
}