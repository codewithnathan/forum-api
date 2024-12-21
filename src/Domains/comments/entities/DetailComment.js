class DetailComment {
	constructor(data) {
		this._validateData(data)

		const {
			id,
			username,
			content,
			date,
			replies,
			is_delete,
			likeCount,
		} = data

		this.id = id
		this.username = username
		this.content = is_delete ? '**komentar telah dihapus**' : content
		this.date = date
		this.replies = replies
		this.likeCount = likeCount
	}

	_validateData(data) {
		const { id, username, content, date, replies, likeCount } = data

		if (!id || !username || !content || !date) {
			throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
		}

		if (
			typeof id !== 'string' ||
			typeof username !== 'string' ||
			typeof content !== 'string' ||
			typeof date !== 'string' ||
			typeof likeCount !== 'number' ||
			!Array.isArray(replies)
		) {
			throw new Error(
				'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
			)
		}
	}
}

module.exports = DetailComment
