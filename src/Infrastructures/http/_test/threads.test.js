const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
	afterAll(async () => {
		await pool.end()
	})

	afterEach(async () => {
		await UsersTableTestHelper.cleanTable()
		await ThreadsTableTestHelper.cleanTable()
		await CommentsTableTestHelper.cleanTable()
		await RepliesTableTestHelper.cleanTable()
	})

	describe('when POST /threads', () => {
		it('should response 201 and new thread', async () => {
			// Arrange
			const requestPayload = {
				title: 'Thread Title',
				body: 'Thread Body',
			}
			const server = await createServer(container)

			// Add user
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedThread).toBeDefined()
		})

		it('should response 400 if payload is missing required properties', async () => {
			// Arrange
			const requestPayload = { title: 'Thread Title' }
			const server = await createServer(container)

			// Add user
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})

			// Action
			const response = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: requestPayload,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(400)
			expect(responseJson.status).toEqual('fail')
			expect(responseJson.message).toEqual(
				'harus mengirimkan title dan body'
			)
		})
	})

	describe('when GET /threads/{threadId}', () => {
		it('should response 200 and return the thread data', async () => {
			// Arrange
			const server = await createServer(container)
			const thread = { title: 'Thread Title', body: 'Thread Body' }
			// Add user and thread
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})

			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: thread,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data

			// Action
			const response = await server.inject({
				method: 'GET',
				url: `/threads/${addedThread.id}`,
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.thread).toBeDefined()
		})
	})

	describe('when POST /threads/{threadId}/comments', () => {
		it('should response 201 and new comment', async () => {
			// Arrange
			const requestPayload = { content: 'This is a comment' }
			const server = await createServer(container)

			// Add user and thread
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})
			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: { title: 'Thread Title', body: 'Thread Body' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data

			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments`,
				payload: requestPayload,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedComment).toBeDefined()
		})
	})

	describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
		it('should response 200 if comment deleted successfully', async () => {
			// Arrange
			const server = await createServer(container)
			const comment = { content: 'This is a comment' }
			// Add user, thread, and comment
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})
			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: { title: 'Thread Title', body: 'Thread Body' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data
			const addCommentResponse = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments`,
				payload: comment,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedComment } = JSON.parse(
				addCommentResponse.payload
			).data

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
		})
	})
	describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
		it('should response 201 and new reply', async () => {
			// Arrange
			const requestPayload = { content: 'This is a reply' }
			const server = await createServer(container)

			// Add user and thread
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})
			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: { title: 'Thread Title', body: 'Thread Body' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data

			const addedCommentResponse = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments`,
				payload: { content: 'This is a comment' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			const { addedComment } = JSON.parse(
				addedCommentResponse.payload
			).data
			// Action
			const response = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
				payload: requestPayload,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(201)
			expect(responseJson.status).toEqual('success')
			expect(responseJson.data.addedReply).toBeDefined()
		})
	})

	describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
		it('should response 200 if reply deleted successfully', async () => {
			// Arrange
			const server = await createServer(container)
			const reply = { content: 'This is a reply' }
			// Add user, thread, and comment
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})

			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: { title: 'Thread Title', body: 'Thread Body' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data

			const addCommentResponse = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments`,
				payload: { content: 'This is a comment' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedComment } = JSON.parse(
				addCommentResponse.payload
			).data

			const addedReplyResponse = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
				payload: reply,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			const { addedReply } = JSON.parse(
				addedReplyResponse.payload
			).data

			// Action
			const response = await server.inject({
				method: 'DELETE',
				url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
		})
	})

	describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
		it('should response 200 and success', async () => {
			// Arrange
			const server = await createServer(container)

			// Add user and thread
			await server.inject({
				method: 'POST',
				url: '/users',
				payload: {
					username: 'dicoding',
					password: 'secret',
					fullname: 'Dicoding Indonesia',
				},
			})

			const login = await server.inject({
				method: 'POST',
				url: '/authentications',
				payload: {
					username: 'dicoding',
					password: 'secret',
				},
			})
			const addThreadResponse = await server.inject({
				method: 'POST',
				url: '/threads',
				payload: { title: 'Thread Title', body: 'Thread Body' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})
			const { addedThread } = JSON.parse(
				addThreadResponse.payload
			).data

			const addedCommentResponse = await server.inject({
				method: 'POST',
				url: `/threads/${addedThread.id}/comments`,
				payload: { content: 'This is a comment' },
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			const { addedComment } = JSON.parse(
				addedCommentResponse.payload
			).data

			// Action
			const response = await server.inject({
				method: 'PUT',
				url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
				headers: {
					authorization: `Bearer ${
						JSON.parse(login.payload).data.accessToken
					}`,
				},
			})

			// Assert
			const responseJson = JSON.parse(response.payload)
			expect(response.statusCode).toEqual(200)
			expect(responseJson.status).toEqual('success')
		})
	})
})
