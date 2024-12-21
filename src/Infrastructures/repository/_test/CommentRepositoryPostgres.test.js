const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')

const NewComment = require('../../../Domains/comments/entities/NewComment')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('verifyAvailableComment function', () => {
		it('should not throw NotFoundError when comment is available', async () => {
			// Arrange
			const userId = 'user-1234'
			const threadId = 'thread-123'
			const commentId = 'comment-123'

			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				commentRepositoryPostgres.verifyAvailableComment(commentId)
			).resolves.not.toThrowError(NotFoundError)
		})
		it('should throw not found error when the comment does not exist', async () => {
			// Arrange
			const userId = 'user-1234'
			const threadId = 'thread-123'
			const commentId = 'comment-123'

			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				commentRepositoryPostgres.verifyAvailableComment(
					'comment-111'
				)
			).rejects.toThrowError(NotFoundError)
		})
	})

	describe('verifyCommentByUserId function', () => {
		it('should not throw authorization error when the owner is the same', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'

			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				commentRepositoryPostgres.verifyCommentByUserId(
					userId,
					threadId,
					commentId
				)
			).resolves.not.toThrowError(AuthorizationError)
		})

		it('should throw authorization error when the owner is different', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'

			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				commentRepositoryPostgres.verifyCommentByUserId(
					'user-111',
					threadId,
					commentId
				)
			).rejects.toThrowError(AuthorizationError)
		})
	})

	describe('getCommentsByThreadId function', () => {
		it('should return correct data', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'

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
				date: '2024-12-07T01:34:51.595Z',
				id: commentId,
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			const comments =
				await commentRepositoryPostgres.getCommentsByThreadId(
					threadId
				)

			expect(comments).toStrictEqual([
				{
					id: commentId,
					username: 'dicoding',
					date: '2024-12-07T01:34:51.595Z',
					content: 'This is a comment',
					is_delete: false,
				},
			])
		})
	})

	describe('addComment function', () => {
		it('should persist add comment and return added comment correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})

			const newComment = new NewComment({
				content: 'sebuah komentar',
			})

			const fakeIdGenerator = () => '123'
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			await commentRepositoryPostgres.addComment(
				userId,
				threadId,
				newComment
			)

			// Assert
			const comments = await CommentsTableTestHelper.findCommentById(
				'comment-123'
			)
			expect(comments).toHaveLength(1)
		})

		it('should return added comment correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})

			const newComment = new NewComment({
				content: 'sebuah komentar',
			})

			const fakeIdGenerator = () => '123'
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			const addedComment = await commentRepositoryPostgres.addComment(
				userId,
				threadId,
				newComment
			)

			expect(addedComment).toStrictEqual({
				id: 'comment-123',
				content: 'sebuah komentar',
				owner: userId,
			})
		})
	})

	describe('deleteComment function', () => {
		it('should delete the comment percisely', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			const commentId = 'comment-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})
			await CommentsTableTestHelper.addComment({
				owner: userId,
				threadId: threadId,
				id: commentId,
				date: '2024-12-07T01:44:58.491Z',
			})

			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				{}
			)

			// Action
			await commentRepositoryPostgres.deleteComment(
				threadId,
				commentId
			)

			const deletedComment =
				await CommentsTableTestHelper.findCommentById(commentId)

			expect(deletedComment[0]).toStrictEqual({
				id: commentId,
				content: 'This is a comment',
				date: '2024-12-07T01:44:58.491Z',
				owner: userId,
				thread_id: threadId,
				is_delete: true,
			})
		})
	})
})
