class UpdateLikeUseCase {
	constructor({
		threadRepository,
		commentRepository,
		likeRepository,
	}) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._likeRepository = likeRepository
	}

	async execute(userId, threadId, commentId) {
		await this._threadRepository.verifyAvailableThread(threadId)
		await this._commentRepository.verifyAvailableComment(commentId)

		const count = await this._likeRepository.verifyAvailableLike(
			userId,
			commentId
		)

		if (count > 0) {
			await this._likeRepository.decreaseLike(userId, commentId)
		} else {
			await this._likeRepository.addLike(userId, commentId)
		}
	}
}

module.exports = UpdateLikeUseCase
