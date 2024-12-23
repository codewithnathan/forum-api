const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class ThreadRepositoryPostgres extends ThreadRepository {
	constructor(pool, idGenerator) {
		super()
		this._pool = pool
		this._idGenerator = idGenerator
	}

	async verifyAvailableThread(threadId) {
		const query = {
			text: 'SELECT id FROM threads WHERE id = $1',
			values: [threadId],
		}

		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak tersedia')
		}
	}

	async addThread(userId, thread) {
		const { title, body } = thread
		const id = `thread-${this._idGenerator()}`
		const date = new Date().toISOString()

		const query = {
			text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
			values: [id, title, body, date, userId],
		}

		const result = await this._pool.query(query)

		return result.rows[0]
	}

	async getThreadById(threadId) {
		const query = {
			text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
				   FROM threads
				   LEFT JOIN users ON users.id = threads.owner
				   WHERE threads.id = $1;`,
			values: [threadId],
		}
		const result = await this._pool.query(query)

		if (!result.rowCount) {
			throw new NotFoundError('thread tidak tersedia')
		}

		return result.rows[0]
	}
}

module.exports = ThreadRepositoryPostgres
