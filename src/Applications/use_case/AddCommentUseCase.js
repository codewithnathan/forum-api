const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
	constructor({ threadRepository, commentRepository }) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
	}

	async execute(userId, threadId, useCasePayload) {
		const comment = new NewComment(useCasePayload)

		await this._threadRepository.verifyAvailableThread(threadId)

		const result = await this._commentRepository.addComment(
			userId,
			threadId,
			comment
		)

		return result
	}
}

module.exports = AddCommentUseCase
