const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
	async addLike(
		id = 'like-123',
		userId = 'user-123',
		commentId = 'comment-123'
	) {
		const query = {
			text: 'INSERT INTO likes (id, count, user_id, comment_id) VALUES ($1, $2, $3, $4);',
			values: [id, 1, userId, commentId],
		}
		await pool.query(query)
	},
	async findLikeById(id) {
		const query = {
			text: 'SELECT * FROM likes WHERE id = $1',
			values: [id],
		}
		const result = await pool.query(query)
		return result.rows
	},
	async cleanTable() {
		await pool.query('DELETE FROM likes WHERE 1=1')
	},
}

module.exports = LikesTableTestHelper
