const GetThreadUseCase = require('../GetThreadUseCase')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')

describe('GetThreadUseCase', () => {
	it('should orchestrating the get thread action correctly', async () => {
		// Arrange
		const threadId = 'thread-123'
		const mockThread = {
			id: 'thread-123',
			title: 'sebuah thread',
			body: 'isi thread',
			date: '2024-12-07T01:50:56.105Z',
			username: 'dicoding',
		}

		const mockComments = [
			{
				id: 'comment-123',
				username: 'johndoe',
				date: '2024-12-07T01:50:56.105Z',
				content: 'sebuah komentar',
				is_delete: false,
			},
			{
				id: 'comment-124',
				username: 'dicoder',
				date: '2024-12-07T01:50:56.105Z',
				content: 'sebuah komentar',
				is_delete: true,
			},
		]

		const mockReplies = [
			{
				id: 'reply-123',
				content: 'sebuah balasan',
				date: '2024-12-07T01:50:56.105Z',
				owner: 'user-123',
				thread_id: 'thread-123',
				comment_id: 'comment-123',
				is_delete: false,
				username: 'dicoding',
			},
			{
				id: 'reply-124',
				content: 'sebuah balasan',
				date: '2024-12-07T01:50:56.105Z',
				owner: 'user-123',
				thread_id: 'thread-123',
				comment_id: 'comment-123',
				is_delete: true,
				username: 'dicoding',
			},
			{
				id: 'reply-125',
				content: 'sebuah balasan',
				date: '2024-12-07T01:50:56.105Z',
				owner: 'user-124',
				thread_id: 'thread-123',
				comment_id: 'comment-124',
				is_delete: false,
				username: 'johndoe',
			},
		]

		const mockThreadRepository = new ThreadRepository()
		const mockCommentRepository = new CommentRepository()
		const mockReplyRepository = new ReplyRepository()
		const mockLikeRepository = new LikeRepository()

		mockThreadRepository.getThreadById = jest.fn(() =>
			Promise.resolve(mockThread)
		)
		mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
			Promise.resolve(mockComments)
		)
		mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
			Promise.resolve(mockReplies)
		)
		mockLikeRepository.getTotalLikeByCommentId = jest.fn(
			(commentId) => {
				if (commentId === 'comment-123') return Promise.resolve(1)
				if (commentId === 'comment-124') return Promise.resolve(2)
				return Promise.resolve(0)
			}
		)

		const getThreadUseCase = new GetThreadUseCase({
			threadRepository: mockThreadRepository,
			commentRepository: mockCommentRepository,
			replyRepository: mockReplyRepository,
			likeRepository: mockLikeRepository,
		})

		// Action
		const thread = await getThreadUseCase.execute(threadId)

		// Assert
		expect(thread).toStrictEqual(
			new DetailThread({
				id: 'thread-123',
				title: 'sebuah thread',
				body: 'isi thread',
				date: '2024-12-07T01:50:56.105Z',
				username: 'dicoding',
				comments: [
					new DetailComment({
						id: 'comment-123',
						username: 'johndoe',
						date: '2024-12-07T01:50:56.105Z',
						content: 'sebuah komentar',
						replies: [
							new DetailReply({
								id: 'reply-123',
								username: 'dicoding',
								content: 'sebuah balasan',
								date: '2024-12-07T01:50:56.105Z',
							}),
							new DetailReply({
								id: 'reply-124',
								username: 'dicoding',
								date: '2024-12-07T01:50:56.105Z',
								content: '**balasan telah dihapus**',
							}),
						],
						likeCount: 1,
					}),
					new DetailComment({
						id: 'comment-124',
						username: 'dicoder',
						date: '2024-12-07T01:50:56.105Z',
						content: '**komentar telah dihapus**',
						replies: [],
						likeCount: 2,
					}),
				],
			})
		)
		expect(mockThreadRepository.getThreadById).toBeCalledWith(
			threadId
		)
		expect(
			mockCommentRepository.getCommentsByThreadId
		).toBeCalledWith(threadId)
		expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
			threadId
		)
	})
})
