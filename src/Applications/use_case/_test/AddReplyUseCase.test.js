const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReplyUseCase = require('../AddReplyUseCase')
const NewReply = require('../../../Domains/replies/entities/NewReply')

describe('AddReplyUseCase', () => {
	it('should orchestrating the add reply action correctly', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'

		const useCasePayload = {
			content: 'sebuah balasan',
		}

		const mockAddedReply = {
			id: 'reply-123',
			content: useCasePayload.content,
			owner: 'dicoding',
		}

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.verifyAvailableComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockReplyRepository.addReply = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedReply))

		const addReplyUseCase = new AddReplyUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
		})

		const addedReply = await addReplyUseCase.execute(
			userId,
			threadId,
			commentId,
			useCasePayload
		)

		expect(addedReply).toStrictEqual({
			id: 'reply-123',
			content: useCasePayload.content,
			owner: 'dicoding',
		})

		expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
			threadId
		)
		expect(
			mockCommentRepository.verifyAvailableComment
		).toBeCalledWith(commentId)
		expect(mockReplyRepository.addReply).toBeCalledWith(
			userId,
			threadId,
			commentId,
			new NewReply(useCasePayload)
		)
	})
})
