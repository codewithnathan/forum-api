class DeleteReplyUseCase {
	constructor({
		threadRepository,
		commentRepository,
		replyRepository,
	}) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._replyRepository = replyRepository
	}

	async execute(userId, threadId, commentId, replyId) {
		await this._threadRepository.verifyAvailableThread(threadId)
		await this._commentRepository.verifyAvailableComment(commentId)
		await this._replyRepository.verifyAvailableReply(replyId)
		await this._replyRepository.verifyReplyByUserId(
			userId,
			threadId,
			commentId,
			replyId
		)

		await this._replyRepository.deleteReply(
			threadId,
			commentId,
			replyId
		)
	}
}

module.exports = DeleteReplyUseCase
