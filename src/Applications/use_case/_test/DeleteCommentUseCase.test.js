const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
	it('should orchestrating the delete comment action correctly', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyAvailableComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyCommentByUserId = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.deleteComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())

		const deleteCommentUseCase = new DeleteCommentUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
		})

		await deleteCommentUseCase.execute(userId, threadId, commentId)

		expect(
			mockThreadRepository.verifyAvailableThread
		).toHaveBeenCalledWith(threadId)
		expect(
			mockCommentRepository.verifyAvailableComment
		).toHaveBeenCalledWith(commentId)
		expect(
			mockCommentRepository.verifyCommentByUserId
		).toHaveBeenCalledWith(userId, threadId, commentId)
		expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
			threadId,
			commentId
		)
	})
})
