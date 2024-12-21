const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async verifyAvailableComment(commentId) {
		const query = {
			text: 'SELECT id FROM comments WHERE id = $1',
			values: [commentId],
		}

		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new NotFoundError('comment tidak tersedia')
		}
	}

	async verifyCommentByUserId(userId, threadId, commentId) {
		const query = {
			text: 'SELECT id FROM comments WHERE owner = $1 AND thread_id = $2 AND id = $3',
			values: [userId, threadId, commentId],
		}

		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new AuthorizationError(
				'tidak boleh menghapus comment orang lain'
			)
		}
	}

	async getCommentsByThreadId(threadId) {
		const query = {
			text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1 ORDER BY comments.date ASC',
			values: [threadId],
		}
		const result = await this._pool.query(query)
		return result.rows
	}

	async addComment(userId, threadId, comment) {
		const { content } = comment
		const id = `comment-${this._idGenerator()}`
		const date = new Date().toISOString()

		const query = {
			text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
			values: [id, content, date, userId, threadId],
		}

		const result = await this._pool.query(query)

		return result.rows[0]
	}

	async deleteComment(threadId, commentId) {
		const query = {
			text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 AND thread_id = $2 RETURNING id;',
			values: [commentId, threadId],
		}

		await this._pool.query(query)
	}
}

module.exports = CommentRepositoryPostgres
