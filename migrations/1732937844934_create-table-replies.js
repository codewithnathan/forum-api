/* eslint-disable camelcase */
exports.up = (pgm) => {
	pgm.createTable('replies', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		content: {
			type: 'TEXT',
		},
		date: {
			type: 'TEXT',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(50)',
		},
		thread_id: {
			type: 'VARCHAR(50)',
		},
		comment_id: {
			type: 'VARCHAR(50)',
		},
		is_delete: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
	})

	pgm.addConstraint(
		'replies',
		'fk_replies.owner_users.id',
		'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
	)

	pgm.addConstraint(
		'replies',
		'fk_replies.thread_id_threads.id',
		'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
	)

	pgm.addConstraint(
		'replies',
		'fk_replies.comment_id_comments.id',
		'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
	)
}

exports.down = (pgm) => {
	pgm.dropTable('replies')
}
