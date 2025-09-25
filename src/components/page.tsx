'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Video {
  id: number
  title: string
  playback_filename: string
  master_filename: string
  upload_timestamp: string
  user: {
    username: string
  }
}

export default function VideoPage() {
  const params = useParams()
  const { id } = params
  const { token, isAuthenticated } = useAuth()

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          setLoading(true)
          const response = await fetch(`http://localhost:5000/api/videos/${id}`)
          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || '영상을 불러오는데 실패했습니다.')
          }
          const data = await response.json()
          setVideo(data)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchVideo()
    }
  }, [id])

  const handleVerify = useCallback(async () => {
    if (!video || !token) {
      setVerificationResult('워터마크를 확인하려면 로그인이 필요합니다.')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)
    try {
      const response = await fetch(
        `http://localhost:5000/api/videos/${video.id}/verify`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      if (response.ok) {
        setVerificationResult(`✅ 확인된 정보: ${data.watermark}`)
      } else {
        setVerificationResult(`❌ 확인 실패: ${data.error || data.watermark}`)
      }
    } catch (error) {
      setVerificationResult('❌ 서버와 통신 중 오류가 발생했습니다.')
    } finally {
      setIsVerifying(false)
    }
  }, [video, token])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        로딩 중...
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-red-500">
        {error}
      </main>
    )
  }

  if (!video) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        영상을 찾을 수 없습니다.
      </main>
    )
  }

  const playbackUrl = `http://localhost:5000/outputs/${video.playback_filename}`

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
          <video src={playbackUrl} controls autoPlay className="w-full h-full">
            브라우저가 비디오 태그를 지원하지 않습니다.
          </video>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{video.title}</h1>
        <div className="text-sm text-slate-500 mt-2 mb-6">
          <span>by {video.user.username}</span>
          <span className="mx-2">·</span>
          <span>
            {new Date(video.upload_timestamp).toLocaleDateString('ko-KR')}
          </span>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleVerify}
            disabled={isVerifying || !isAuthenticated}
            className="w-full sm:w-auto flex justify-center items-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isVerifying ? '확인 중...' : '워터마크 정보 확인'}
          </button>
          {!isAuthenticated && (
            <p className="text-xs text-slate-500">
              워터마크를 확인하려면{' '}
              <Link href="/login" className="underline hover:text-blue-500">
                로그인
              </Link>
              이 필요합니다.
            </p>
          )}
          {verificationResult && (
            <div
              className={`p-4 rounded-lg text-sm font-medium ${
                verificationResult.startsWith('✅')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {verificationResult}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
