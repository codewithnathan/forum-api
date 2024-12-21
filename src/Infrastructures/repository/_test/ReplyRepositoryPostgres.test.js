const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const pool = require('../../database/postgres/pool')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NewReply = require('../../../Domains/replies/entities/NewReply')

describe('ReplyRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await RepliesTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('verifyAvailableReply function', () => {
		it('should not throw NotFoundError when reply is available', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})
			await RepliesTableTestHelper.addReply({
				owner: userId,
				threadId: threadId,
				commentId: commentId,
				id: replyId,
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				replyRepositoryPostgres.verifyAvailableReply(replyId)
			).resolves.not.toThrowError(NotFoundError)
		})
		it('should throw not found error when the reply does not exist', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})
			await RepliesTableTestHelper.addReply({
				owner: userId,
				threadId: threadId,
				commentId: commentId,
				id: replyId,
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				replyRepositoryPostgres.verifyAvailableReply('reply-111')
			).rejects.toThrowError(NotFoundError)
		})
	})

	describe('verifyReplyByUserId function', () => {
		it('shpuld not return authorization error when the owner is the same', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})
			await RepliesTableTestHelper.addReply({
				owner: userId,
				threadId: threadId,
				commentId: commentId,
				id: replyId,
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			await expect(
				replyRepositoryPostgres.verifyReplyByUserId(
					userId,
					threadId,
					commentId,
					replyId
				)
			).resolves.not.toThrowError(AuthorizationError)
		})

		it('should return authorization error when the owner is different', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})
			await RepliesTableTestHelper.addReply({
				owner: userId,
				threadId: threadId,
				commentId: commentId,
				id: replyId,
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			await expect(
				replyRepositoryPostgres.verifyReplyByUserId(
					'user-111',
					threadId,
					commentId,
					replyId
				)
			).rejects.toThrowError(AuthorizationError)
		})
	})

	describe('getRepliesByThreadId function', () => {
		it('should return data correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})
			await RepliesTableTestHelper.addReply({
				owner: userId,
				threadId: threadId,
				commentId: commentId,
				id: replyId,
				date: '2024-12-07T02:06:34.306Z',
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			const replies =
				await replyRepositoryPostgres.getRepliesByThreadId(threadId)

			expect(replies[0]).toStrictEqual({
				id: replyId,
				content: 'This is a reply',
				date: '2024-12-07T02:06:34.306Z',
				owner: userId,
				thread_id: threadId,
				comment_id: commentId,
				is_delete: false,
				username: 'dicoding',
			})
		})
	})

	describe('addReply function', () => {
		it('should persist add comment and return added comment correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const newReply = new NewReply({
				content: 'sebuah balasan',
			})

			const fakeIdGenerator = () => '123'
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			await replyRepositoryPostgres.addReply(
				userId,
				threadId,
				commentId,
				newReply
			)

			const replies = await RepliesTableTestHelper.findReplyById(
				replyId
			)

			expect(replies).toHaveLength(1)
		})

		it('should return data correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({
				id: userId,
			})
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const newReply = new NewReply({
				content: 'sebuah balasan',
			})

			const fakeIdGenerator = () => '123'
			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			const addedReply = await replyRepositoryPostgres.addReply(
				userId,
				threadId,
				commentId,
				newReply
			)

			expect(addedReply).toStrictEqual({
				id: replyId,
				content: 'sebuah balasan',
				owner: userId,
			})
		})
	})

	describe('deleteReply function', () => {
		it('should delete the comment percisely', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			const replyId = 'reply-123'

			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				id: commentId,
				owner: userId,
				threadId: threadId,
			})
			await RepliesTableTestHelper.addReply({
				id: replyId,
				commentId: commentId,
				threadId: threadId,
				date: '2024-12-07T02:27:19.192Z',
				owner: userId,
			})

			const replyRepositoryPostgres = new ReplyRepositoryPostgres(
				pool,
				{}
			)

			// Action
			await replyRepositoryPostgres.deleteReply(
				threadId,
				commentId,
				replyId
			)

			const deletedReply = await RepliesTableTestHelper.findReplyById(
				replyId
			)

			expect(deletedReply[0]).toStrictEqual({
				id: replyId,
				content: 'This is a reply',
				date: '2024-12-07T02:27:19.192Z',
				owner: userId,
				thread_id: threadId,
				comment_id: commentId,
				is_delete: true,
			})
		})
	})
})
