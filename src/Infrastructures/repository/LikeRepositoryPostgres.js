const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async addLike(userId, commentId) {
		const id = `like-${this._idGenerator()}`
		const query = {
			text: 'INSERT INTO likes (id, count, user_id, comment_id) VALUES ($1, $2, $3, $4);',
			values: [id, 1, userId, commentId],
		}
		await this._pool.query(query)
	}

	async decreaseLike(userId, commentId) {
		const query = {
			text: 'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
			values: [userId, commentId],
		}

		await this._pool.query(query)
	}

	async verifyAvailableLike(userId, commentId) {
		const query = {
			text: 'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2',
			values: [userId, commentId],
		}

		const result = await this._pool.query(query)
		return result.rowCount
	}

	async getTotalLikeByCommentId(commentId) {
		const query = {
			text: 'SELECT COALESCE(SUM(count), 0) AS total_likes FROM likes WHERE comment_id = $1',
			values: [commentId],
		}
		const result = await this._pool.query(query)
		return result.rows[0].total_likes
	}
}

module.exports = LikeRepositoryPostgres
