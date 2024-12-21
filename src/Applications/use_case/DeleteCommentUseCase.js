class DeleteCommentUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(userId, threadId, commentId) {
		await this._threadRepository.verifyAvailableThread(threadId)
		await this._commentRepository.verifyAvailableComment(commentId)
		await this._commentRepository.verifyCommentByUserId(
			userId,
			threadId,
			commentId
		)
		await this._commentRepository.deleteComment(threadId, commentId)
	}
}

module.exports = DeleteCommentUseCase
