const DetailComment = require('../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../Domains/replies/entities/DetailReply')
const DetailThread = require('../../Domains/threads/entities/DetailThread')

class GetThreadUseCase {
	constructor({
		threadRepository,
		commentRepository,
		replyRepository,
		likeRepository,
	}) {
		this._threadRepository = threadRepository
		this._commentRepository = commentRepository
		this._replyRepository = replyRepository
		this._likeRepository = likeRepository
	}

	async execute(threadId) {
		const thread = await this._threadRepository.getThreadById(
			threadId
		)
		const comments =
			await this._commentRepository.getCommentsByThreadId(threadId)

		const replies = await this._replyRepository.getRepliesByThreadId(
			threadId
		)

		const commentIds = comments.map((comment) => comment.id)

		const likes = await Promise.all(
			commentIds.map(async (id) => {
				const like =
					await this._likeRepository.getTotalLikeByCommentId(id)
				return Number(like)
			})
		)

		thread.comments = comments.map(
			(comment, idx) =>
				new DetailComment({
					...comment,
					likeCount: likes[idx],
					replies: comment.is_delete
						? []
						: replies
								.filter((reply) => reply.comment_id === comment.id)
								.map((reply) => new DetailReply(reply)),
				})
		)
		return new DetailThread(thread)
	}
}

module.exports = GetThreadUseCase
