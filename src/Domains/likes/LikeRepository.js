class LikeRepository {
	async addLike(userId, commentId) {
		throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async verifyAvailableLike(userId, commentId) {
		throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async decreaseLike(userId, commentId) {
		throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async getTotalLikeByCommentId(commentId) {
		throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
}

module.exports = LikeRepository
