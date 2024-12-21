const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
	it('should orchestrating the delete comment action correctly', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'
		const replyId = 'reply-123'

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyAvailableComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.verifyAvailableReply = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.verifyReplyByUserId = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.deleteReply = jest
			.fn()
			.mockImplementation(() => Promise.resolve())

		const deleteReplyUseCase = new DeleteReplyUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
		})

		await deleteReplyUseCase.execute(
			userId,
			threadId,
			commentId,
			replyId
		)

		expect(
			mockThreadRepository.verifyAvailableThread
		).toHaveBeenCalledWith(threadId)
		expect(
			mockCommentRepository.verifyAvailableComment
		).toHaveBeenCalledWith(commentId)
		expect(
			mockReplyRepository.verifyAvailableReply
		).toHaveBeenCalledWith(replyId)
		expect(
			mockReplyRepository.verifyReplyByUserId
		).toHaveBeenCalledWith(userId, threadId, commentId, replyId)
		expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
			threadId,
			commentId,
			replyId
		)
	})
})
