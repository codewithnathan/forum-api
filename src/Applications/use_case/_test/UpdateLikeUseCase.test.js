const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const UpdateLikeUseCase = require('../UpdateLikeUseCase')

describe('UpdateLikeUseCase', () => {
	it('should orchestrating the update like action correctly if the count value is 0', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockLikeRepository = new LikeRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyAvailableComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockLikeRepository.verifyAvailableLike = jest
			.fn()
			.mockImplementation(() => Promise.resolve(0))

		mockLikeRepository.addLike = jest
			.fn()
			.mockImplementation(() => Promise.resolve())

		const updateLikeUseCase = new UpdateLikeUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			likeRepository: mockLikeRepository,
		})

		await updateLikeUseCase.execute(userId, threadId, commentId)

		expect(
			mockThreadRepository.verifyAvailableThread
		).toHaveBeenCalledWith(threadId)
		expect(
			mockCommentRepository.verifyAvailableComment
		).toHaveBeenCalledWith(commentId)
		expect(
			mockLikeRepository.verifyAvailableLike
		).toHaveBeenCalledWith(userId, commentId)
		expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
			userId,
			commentId
		)
	})
	it('should orchestrating the update like action correctly if the count value more than 0', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockLikeRepository = new LikeRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyAvailableComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockLikeRepository.verifyAvailableLike = jest
			.fn()
			.mockImplementation(() => Promise.resolve(1))

		mockLikeRepository.decreaseLike = jest
			.fn()
			.mockImplementation(() => Promise.resolve())

		const updateLikeUseCase = new UpdateLikeUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			likeRepository: mockLikeRepository,
		})

		await updateLikeUseCase.execute(userId, threadId, commentId)

		expect(
			mockThreadRepository.verifyAvailableThread
		).toHaveBeenCalledWith(threadId)
		expect(
			mockCommentRepository.verifyAvailableComment
		).toHaveBeenCalledWith(commentId)
		expect(
			mockLikeRepository.verifyAvailableLike
		).toHaveBeenCalledWith(userId, commentId)
		expect(mockLikeRepository.decreaseLike).toHaveBeenCalledWith(
			userId,
			commentId
		)
	})
})
