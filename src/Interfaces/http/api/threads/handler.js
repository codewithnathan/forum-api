const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')
const UpdateLikeUseCase = require('../../../../Applications/use_case/UpdateLikeUseCase')

class ThreadsHandler {
	constructor(container) {
		this._container = container

		this.postThreadHandler = this.postThreadHandler.bind(this)
		this.postCommentHandler = this.postCommentHandler.bind(this)
		this.getThreadHandler = this.getThreadHandler.bind(this)
		this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
		this.postReplyHandler = this.postReplyHandler.bind(this)
		this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
		this.updateLikeHandler = this.updateLikeHandler.bind(this)
	}

	async postThreadHandler(request, h) {
		const { id: userId } = request.auth.credentials

		const addThreadUseCase = this._container.getInstance(
			AddThreadUseCase.name
		)
		const addedThread = await addThreadUseCase.execute(
			userId,
			request.payload
		)
		const response = h.response({
			status: 'success',
			data: {
				addedThread,
			},
		})
		response.code(201)
		return response
	}

	async postCommentHandler(request, h) {
		const { id: userId } = request.auth.credentials
		const { id: threadId } = request.params

		const addCommentUseCase = this._container.getInstance(
			AddCommentUseCase.name
		)

		const addedComment = await addCommentUseCase.execute(
			userId,
			threadId,
			request.payload
		)

		const response = h.response({
			status: 'success',
			data: {
				addedComment,
			},
		})
		response.code(201)
		return response
	}

	async getThreadHandler(request, h) {
		const { id: threadId } = request.params

		const getThreadUseCase = this._container.getInstance(
			GetThreadUseCase.name
		)

		const thread = await getThreadUseCase.execute(threadId)

		const response = h.response({
			status: 'success',
			data: {
				thread,
			},
		})
		response.code(200)
		return response
	}

	async deleteCommentHandler(request, h) {
		const { id: userId } = request.auth.credentials
		const { thread_id: threadId, comment_id: commentId } =
			request.params

		const deleteCommentUseCase = this._container.getInstance(
			DeleteCommentUseCase.name
		)

		await deleteCommentUseCase.execute(userId, threadId, commentId)

		const response = h.response({
			status: 'success',
		})
		response.code(200)
		return response
	}

	async postReplyHandler(request, h) {
		const { id: userId } = request.auth.credentials
		const { thread_id: threadId, comment_id: commentId } =
			request.params

		const addReplyUseCase = this._container.getInstance(
			AddReplyUseCase.name
		)

		const addedReply = await addReplyUseCase.execute(
			userId,
			threadId,
			commentId,
			request.payload
		)

		const response = h.response({
			status: 'success',
			data: {
				addedReply,
			},
		})
		response.code(201)
		return response
	}

	async deleteReplyHandler(request, h) {
		const { id: userId } = request.auth.credentials
		const {
			thread_id: threadId,
			comment_id: commentId,
			reply_id: replyId,
		} = request.params

		const deleteReplyUseCase = this._container.getInstance(
			DeleteReplyUseCase.name
		)

		await deleteReplyUseCase.execute(
			userId,
			threadId,
			commentId,
			replyId
		)

		const response = h.response({
			status: 'success',
		})
		response.code(200)
		return response
	}

	async updateLikeHandler(request, h) {
		const { id: userId } = request.auth.credentials
		const { thread_id: threadId, comment_id: commentId } =
			request.params

		const updateLikeUseCase = this._container.getInstance(
			UpdateLikeUseCase.name
		)

		await updateLikeUseCase.execute(userId, threadId, commentId)

		const response = h.response({
			status: 'success',
		})
		response.code(200)
		return response
	}
}

module.exports = ThreadsHandler
