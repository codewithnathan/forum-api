const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
	constructor({
		threadRepository,
		commentRepository,
		replyRepository,
	}) {
		this._replyRepository = replyRepository
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(userId, threadId, commentId, useCasePayload) {
		const reply = new NewReply(useCasePayload)

		await this._threadRepository.verifyAvailableThread(threadId)
		await this._commentRepository.verifyAvailableComment(commentId)

		const result = await this._replyRepository.addReply(
			userId,
			threadId,
			commentId,
			reply
		)

		return result
	}
}

module.exports = AddReplyUseCase
