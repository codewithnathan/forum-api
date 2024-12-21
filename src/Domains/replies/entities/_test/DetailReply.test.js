const DetailReply = require('../DetailReply')

describe('DetailReply entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			date: '2024-12-07T01:44:58.491Z',
		}

		// Action & Assert
		expect(() => new DetailReply(payload)).toThrowError(
			'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah balasan',
			date: 123,
		}

		// Action & Assert
		expect(() => new DetailReply(payload)).toThrowError(
			'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should change the content to **balasan telah dihapus** if the is_delete is true', () => {
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah balasan',
			date: '2024-12-07T01:44:58.491Z',
			is_delete: true,
		}

		// Action
		const detailReply = new DetailReply(payload)

		// Assert
		expect(detailReply.content).toBe('**balasan telah dihapus**')
	})

	it('should create DetailReply entities correctly', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah balasan',
			date: '2024-12-07T01:44:58.491Z',
		}

		// Action
		const detailReply = new DetailReply(payload)

		// Assert
		expect(detailReply).toBeInstanceOf(DetailReply)
		expect(detailReply.id).toEqual(payload.id)
		expect(detailReply.username).toEqual(payload.username)
		expect(detailReply.content).toEqual(payload.content)
		expect(detailReply.date).toEqual(payload.date)
	})
})
