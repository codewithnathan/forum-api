class ReplyRepository {
	async verifyReplyByUserId(userId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async verifyAvailableReply(replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}

	async addReply(reply) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}

	async deleteReply(userId, threadId, commentId, replyId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
	async getRepliesByThreadId(threadId) {
		throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	}
}

module.exports = ReplyRepository
