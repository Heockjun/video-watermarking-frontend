'use client'
import { useRef, MouseEvent } from 'react'
import Link from 'next/link'
interface Video {
  id: number
  title: string
  thumbnail_url: string | null // Add thumbnail_url
  original_filename: string
  playback_filename: string
  upload_timestamp: string
  user?: {
    username: string
  }
}

interface VideoCardProps {
  video: Video
  showUploader?: boolean
  onDelete?: (videoId: number) => void
}

export function VideoCard({
  video,
  showUploader = false,
  onDelete,
}: VideoCardProps) {
  const playbackUrl = `http://localhost:5000/outputs/${video.playback_filename}`
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    const playPromise = videoRef.current?.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // 사용자가 마우스를 빠르게 움직여 재생이 중단될 때 발생하는 AbortError를 무시합니다.
        if (error.name !== 'AbortError') {
          console.error('비디오 재생 중 오류 발생:', error)
        }
      })
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleDeleteClick = (e: MouseEvent) => {
    // 링크 내의 버튼 클릭 시 페이지 이동을 막습니다.
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(video.id)
    }
  }

  return (
    <Link href={`/videos/${video.id}`} className="block">
      <div
        className="relative group bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video bg-slate-200 flex items-center justify-center">
          {video.thumbnail_url ? (
            <img
              src={`http://localhost:5000${video.thumbnail_url}`}
              alt={video.title || video.original_filename}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={playbackUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            ></video>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-800 truncate" title={video.title}>
            {video.title}
          </h3>
          {showUploader && video.user && (
            <p className="text-sm text-slate-500">by {video.user.username}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {new Date(video.upload_timestamp).toLocaleString('ko-KR')}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500"
            aria-label="Delete video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </Link>
  )
}
