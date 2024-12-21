const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const NewThread = require('../../../Domains/threads/entities/NewThread')

const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
	})

	afterAll(async () => {
		await pool.end()
	})

	describe('verifyAvailableThread function', () => {
		it('should not throw NotFoundError when thread is available', async () => {
			// Arrange
			const userId = 'user-1234'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})

			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				threadRepositoryPostgres.verifyAvailableThread(threadId)
			).resolves.not.toThrowError(NotFoundError)
		})

		it('should throw NotFoundError if thread does not exist', async () => {
			// Arrange
			const userId = 'user-1234'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})

			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				threadRepositoryPostgres.verifyAvailableThread('thread-111')
			).rejects.toThrowError(NotFoundError)
		})
	})

	describe('addThread function', () => {
		it('should persist add thread and return added thread correctly', async () => {
			// Arrange
			const userId = 'user-123'
			await UsersTableTestHelper.addUser({ id: userId })

			const newThread = new NewThread({
				title: 'judul thread',
				body: 'deskripsi thread',
			})

			const fakeIdGenerator = () => '123'
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			await threadRepositoryPostgres.addThread(userId, newThread)

			// Assert
			const threads = await ThreadsTableTestHelper.findThreadById(
				'thread-123'
			)
			expect(threads).toHaveLength(1)
		})
		it('should return registered user correctly', async () => {
			// Arrange
			const userId = 'user-123'
			await UsersTableTestHelper.addUser({ id: userId })

			const newThread = new NewThread({
				title: 'judul thread',
				body: 'deskripsi thread',
			})

			const fakeIdGenerator = () => '123'
			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				fakeIdGenerator
			)

			// Action
			const addedThread = await threadRepositoryPostgres.addThread(
				userId,
				newThread
			)

			expect(addedThread).toStrictEqual({
				id: 'thread-123',
				title: 'judul thread',
				owner: userId,
			})
		})
	})

	describe('getThreadById function', () => {
		it('should throw not found error when the thread is not available', async () => {
			// Arrange
			const userId = 'user-1234'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
			})

			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				{}
			)

			// Action & Assert
			await expect(
				threadRepositoryPostgres.getThreadById('thread-111')
			).rejects.toThrowError(NotFoundError)
		})

		it('should return data correctly', async () => {
			// Arrange
			const userId = 'user-123'
			const threadId = 'thread-123'
			await UsersTableTestHelper.addUser({ id: userId })
			await ThreadsTableTestHelper.addThread({
				owner: userId,
				id: threadId,
				date: '2024-12-07T01:50:56.105Z',
			})

			const threadRepositoryPostgres = new ThreadRepositoryPostgres(
				pool,
				{}
			)

			// Action
			const thread = await threadRepositoryPostgres.getThreadById(
				threadId
			)

			expect(thread).toStrictEqual({
				id: threadId,
				title: 'Thread Title',
				body: 'Thread Body',
				date: '2024-12-07T01:50:56.105Z',
				username: 'dicoding',
			})
		})
	})
})
