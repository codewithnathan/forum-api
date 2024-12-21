const CommentRepository = require('../../../Domains/comments/CommentRepository')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
	it('should orchestrating the add comment action correctly', async () => {
		const userId = 'user-123'
		const threadId = 'thread-123'
		const useCasePayload = {
			content: 'sebuah komentar',
		}

		const mockAddedComment = {
			id: 'comment-123',
			content: useCasePayload.content,
			owner: 'dicoding',
		}

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()

		mockThreadRepository.verifyAvailableThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve())
		mockCommentRepository.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedComment))

		const addCommentUseCase = new AddCommentUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
		})

		const addedComment = await addCommentUseCase.execute(
			userId,
			threadId,
			useCasePayload
		)

		expect(addedComment).toStrictEqual({
			id: 'comment-123',
			content: useCasePayload.content,
			owner: 'dicoding',
		})
		expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
			threadId
		)
		expect(mockCommentRepository.addComment).toBeCalledWith(
			userId,
			threadId,
			new NewComment(useCasePayload)
		)
	})
})
