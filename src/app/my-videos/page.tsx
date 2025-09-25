'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { VideoCard } from '@/components/VideoCard'

interface Video {
  id: number
  title: string
  original_filename: string
  thumbnail_url: string | null // Add thumbnail_url
  playback_filename: string
  upload_timestamp: string
}

export default function MyVideosPage() {
  const { isAuthenticated, token } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVideos, setTotalVideos] = useState(0)

  interface VideoResponse {
    videos: Video[]
    total_pages: number
    current_page: number
    total_videos: number
  }

  const handleDelete = async (videoId: number) => {
    if (
      !window.confirm(
        '정말로 이 비디오를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '비디오 삭제에 실패했습니다.')
      }
      setVideos((current) => current.filter((video) => video.id !== videoId))
    } catch (err: any) {
      alert(`오류: ${err.message}`)
    }
  }
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchVideos = async () => {
      setLoading(true) // 페이지 변경 시 로딩 상태 활성화
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/my-videos?page=${currentPage}&per_page=8`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('비디오 목록을 불러오는데 실패했습니다.')
        }
        const data: VideoResponse = await response.json()
        setVideos(data.videos)
        setTotalPages(data.total_pages)
        setCurrentPage(data.current_page)
        setTotalVideos(data.total_videos)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [isAuthenticated, token, currentPage])

  if (!isAuthenticated && !loading) {
    return (
      <main className="bg-slate-50 text-gray-800 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">로그인이 필요합니다.</h1>
          <p className="mb-8">내 비디오 목록을 보려면 로그인해주세요.</p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 transition-all"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            내 비디오
          </h1>
          <p className="text-lg text-slate-600">
            내가 업로드하고 보호 중인 비디오 {totalVideos}개 목록입니다.
          </p>
        </div>

        {loading ? (
          <p className="text-center">비디오 목록을 불러오는 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-16">
            <p className="text-xl">업로드한 비디오가 없습니다.</p>
            <Link
              href="/watermark/insert"
              className="mt-4 inline-block text-blue-600 hover:underline font-medium"
            >
              첫 비디오 업로드하기
            </Link>
          </div>
        )}

        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {' '}
              이전{' '}
            </button>
            <span className="text-sm text-slate-600">
              {' '}
              {currentPage} / {totalPages}{' '}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {' '}
              다음{' '}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
