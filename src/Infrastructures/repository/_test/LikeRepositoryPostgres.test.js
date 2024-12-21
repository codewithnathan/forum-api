const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const pool = require('../../database/postgres/pool')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')

describe('LikeRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await LikesTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	it('addLike function', async () => {
		// Arrange
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'
		const likeId = 'like-123'

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
		await LikesTableTestHelper.addLike({
			userId: userId,
			commentId: commentId,
		})

		const fakeIdGenerator = () => '123'
		const likeRepositoryPostgres = new LikeRepositoryPostgres(
			pool,
			fakeIdGenerator
		)

		// Action & Assert
		await likeRepositoryPostgres.addLike(userId, commentId)

		const likes = await LikesTableTestHelper.findLikeById(likeId)

		expect(likes).toHaveLength(1)
	})

	it('decreaseLike function', async () => {
		// Arrange
		const userId = 'user-123'
		const threadId = 'thread-123'
		const commentId = 'comment-123'
		const likeId = 'like-123'

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
		await LikesTableTestHelper.addLike({
			userId: userId,
			commentId: commentId,
		})

		const likeRepositoryPostgres = new LikeRepositoryPostgres(
			pool,
			{}
		)

		await likeRepositoryPostgres.decreaseLike(userId, commentId)

		const decreasedLike = await LikesTableTestHelper.findLikeById(
			likeId
		)

		expect(decreasedLike).toHaveLength(0)
	})

	it('verifyAvailableLike function', async () => {
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
			id: commentId,
		})

		const likeRepositoryPostgres = new LikeRepositoryPostgres(
			pool,
			{}
		)

		const likeCount =
			await likeRepositoryPostgres.verifyAvailableLike(
				userId,
				commentId
			)

		expect(likeCount).toStrictEqual(0)
	})

	it('getTotalLikeByCommentId function', async () => {
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
			id: commentId,
		})
		await LikesTableTestHelper.addLike({
			userId: userId,
			commentId: commentId,
		})

		const likeRepositoryPostgres = new LikeRepositoryPostgres(
			pool,
			{}
		)

		const totalLike =
			await likeRepositoryPostgres.getTotalLikeByCommentId(commentId)

		expect(totalLike).toStrictEqual('1')
	})
})
