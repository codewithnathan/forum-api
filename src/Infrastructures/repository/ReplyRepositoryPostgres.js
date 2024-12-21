const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')

class ReplyRepositoryPostgres extends ReplyRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async verifyAvailableReply(replyId) {
		const query = {
			text: 'SELECT id FROM replies WHERE id = $1',
			values: [replyId],
		}

		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new NotFoundError('reply tidak tersedia')
		}
	}

	async verifyReplyByUserId(userId, threadId, commentId, replyId) {
		const query = {
			text: 'SELECT id FROM replies WHERE owner = $1 AND thread_id = $2 AND comment_id = $3 AND id = $4',
			values: [userId, threadId, commentId, replyId],
		}

		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new AuthorizationError(
				'tidak boleh menghapus comment orang lain'
			)
		}
	}

	async getRepliesByThreadId(threadId) {
		const query = {
			text: `SELECT replies.*, users.username 
			  FROM replies
			  LEFT JOIN users ON users.id = replies.owner
			  LEFT JOIN comments ON comments.id = replies.comment_id
			  WHERE comments.thread_id = $1 AND comments.is_delete = false
			  ORDER BY replies.date ASC`,
			values: [threadId],
		}

		const result = await this._pool.query(query)

		return result.rows
	}

	async addReply(userId, threadId, commentId, reply) {
		const { content } = reply
		const id = `reply-${this._idGenerator()}`
		const date = new Date().toISOString()

		const query = {
			text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
			values: [id, content, date, userId, threadId, commentId],
		}

		const result = await this._pool.query(query)

		return result.rows[0]
	}

	async deleteReply(threadId, commentId, replyId) {
		const query = {
			text: `
				UPDATE replies
				SET 
					is_delete = TRUE
				WHERE 
					id = $1 AND thread_id = $2 AND comment_id = $3
				RETURNING id;
			`,
			values: [replyId, threadId, commentId],
		}

		await this._pool.query(query)
	}
}

module.exports = ReplyRepositoryPostgres
