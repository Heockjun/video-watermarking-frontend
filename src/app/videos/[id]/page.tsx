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

interface Comment {
  id: number
  text: string
  timestamp: string
  user: {
    id: number
    username: string
  }
}

export default function VideoPage() {
  const params = useParams()
  const { id } = params
  const { token, isAuthenticated, userId, role } = useAuth()

  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  )
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [isUpdatingComment, setIsUpdatingComment] = useState(false)

  useEffect(() => {
    if (id) {
      const fetchVideoAndComments = async () => {
        try {
          setLoading(true)
          setError(null)

          // Fetch video and comments in parallel
          const [videoResponse, commentsResponse] = await Promise.all([
            fetch(`http://localhost:5000/api/videos/${id}`),
            fetch(`http://localhost:5000/api/videos/${id}/comments`),
          ])

          if (!videoResponse.ok) {
            const data = await videoResponse.json()
            throw new Error(data.error || '영상을 불러오는데 실패했습니다.')
          }
          const videoData = await videoResponse.json()
          setVideo(videoData)

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json()
            setComments(commentsData)
          } else {
            console.error('댓글을 불러오는데 실패했습니다.')
          }
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchVideoAndComments()
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

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !video || !token) return

    setIsPostingComment(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/videos/${video.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      )

      const data = await response.json()
      if (response.ok) {
        setComments([...comments, data])
        setNewComment('')
      } else {
        alert(`댓글 등록 실패: ${data.error}`)
      }
    } finally {
      setIsPostingComment(false)
    }
  }

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCommentId || !editingCommentText.trim()) return

    setIsUpdatingComment(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${editingCommentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editingCommentText }),
        }
      )
      const updatedComment = await response.json()
      if (response.ok) {
        setComments(
          comments.map((c) => (c.id === editingCommentId ? updatedComment : c))
        )
        setEditingCommentId(null)
      } else {
        alert(`댓글 수정 실패: ${updatedComment.error}`)
      }
    } finally {
      setIsUpdatingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId))
      } else {
        const data = await response.json()
        alert(`댓글 삭제 실패: ${data.error}`)
      }
    } catch (err) {
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

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

        {/* Comments Section */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            댓글 ({comments.length})
          </h2>

          {isAuthenticated && (
            <form onSubmit={handlePostComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows={3}
                placeholder="댓글을 입력하세요..."
                required
              ></textarea>
              <div className="text-right mt-2">
                <button
                  type="submit"
                  disabled={isPostingComment || !newComment.trim()}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isPostingComment ? '등록 중...' : '댓글 등록'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                    {' '}
                    {comment.user.username.charAt(0).toUpperCase()}{' '}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline space-x-2">
                      <p className="font-semibold text-slate-800">
                        {comment.user.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        {' '}
                        {new Date(comment.timestamp).toLocaleString(
                          'ko-KR'
                        )}{' '}
                      </p>
                    </div>
                    {editingCommentId === comment.id ? (
                      <form onSubmit={handleUpdateComment} className="mt-2">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) =>
                            setEditingCommentText(e.target.value)
                          }
                          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          rows={2}
                          required
                        />
                        <div className="text-right mt-2 space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingCommentId(null)}
                            className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
                          >
                            {' '}
                            취소{' '}
                          </button>
                          <button
                            type="submit"
                            disabled={
                              isUpdatingComment || !editingCommentText.trim()
                            }
                            className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-slate-400"
                          >
                            {' '}
                            {isUpdatingComment ? '저장 중...' : '저장'}{' '}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="text-slate-700 mt-1 whitespace-pre-wrap">
                          {comment.text}
                        </p>
                        {isAuthenticated &&
                          (userId === comment.user.id || role === 'admin') && (
                            <div className="mt-1 space-x-2 text-xs">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id)
                                  setEditingCommentText(comment.text)
                                }}
                                className="text-slate-500 hover:text-blue-600"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-slate-500 hover:text-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">
                아직 댓글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
