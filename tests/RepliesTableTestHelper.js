const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
	async addReply({
		id = 'reply-123',
		content = 'This is a reply',
		date = new Date().toISOString(),
		commentId = 'comment-123',
		threadId = 'thread-123',
		owner = 'user-123',
	}) {
		const query = {
			text: 'INSERT INTO replies (id, content, date, comment_id, thread_id, owner) VALUES ($1, $2, $3, $4, $5, $6)',
			values: [id, content, date, commentId, threadId, owner],
		}

		await pool.query(query)
	},

	async findReplyById(id) {
		const query = {
			text: 'SELECT * FROM replies WHERE id = $1',
			values: [id],
		}
		const result = await pool.query(query)
		return result.rows
	},
	async cleanTable() {
		await pool.query('DELETE FROM replies WHERE 1=1')
	},
}

module.exports = RepliesTableTestHelper
