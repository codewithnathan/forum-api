class DetailReply {
	constructor(data) {
		this._validateData(data)

		const { id, username, content, date, is_delete } = data

		this.id = id
		this.username = username
		this.content = is_delete ? '**balasan telah dihapus**' : content
		this.date = date
	}

	_validateData(data) {
		const { id, username, content, date } = data

		if (!id || !username || !content || !date) {
			throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
		}

		if (
			typeof id !== 'string' ||
			typeof username !== 'string' ||
			typeof content !== 'string' ||
			(typeof date !== 'string' && typeof date !== 'object')
		) {
			throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
		}
	}
}

module.exports = DetailReply
