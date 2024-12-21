class CommentRepository {
	async verifyCommentByUserId(userId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async verifyAvailableComment(commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async addComment(comment) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async deleteComment(threadId, commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async getCommentsByThreadId(threadId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
}

module.exports = CommentRepository
