'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push('/')}
            style={{
                position: 'fixed',
                top: 20,
                right: 24,
                zIndex: 9999,
                background: '#1e2028',
                border: '1px solid #2a2d38',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#9ca3af',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.04em',
                transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#3a3d4a'
                e.currentTarget.style.color = '#10b981'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2a2d38'
                e.currentTarget.style.color = '#9ca3af'
            }}
        >
            ← Topics
        </button>
    )
}