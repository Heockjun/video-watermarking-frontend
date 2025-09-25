// e:\video-watermarker\frontend\src\components\HeaderNav.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function HeaderNav() {
  const { isAuthenticated, role, logout } = useAuth()

  return (
    <nav className="flex items-center space-x-8">
      <Link
        href="/about"
        className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
      >
        기술 소개
      </Link>
      <Link
        href="/watermark/insert"
        className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
      >
        영상 업로드
      </Link>
      {isAuthenticated ? (
        <>
          <Link
            href="/my-videos"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            내 비디오
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            프로필
          </Link>
          <button
            onClick={logout}
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-slate-50 shadow hover:bg-blue-600/90 h-9 px-4 py-2"
          >
            회원가입
          </Link>
        </>
      )}
    </nav>
  )
}
