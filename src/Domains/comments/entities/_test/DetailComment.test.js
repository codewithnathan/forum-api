const DetailComment = require('../DetailComment')

describe('DetailComment entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			date: '2024-12-07T01:44:58.491Z',
		}

		// Action & Assert
		expect(() => new DetailComment(payload)).toThrowError(
			'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah komentar',
			date: '2024-12-07T01:44:58.491Z',
			replies: '',
			likeCount: '',
		}

		// Action & Assert
		expect(() => new DetailComment(payload)).toThrowError(
			'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should change the content to **komentar telah dihapus** if the is_delete is true', () => {
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah komentar',
			date: '2024-12-07T01:44:58.491Z',
			likeCount: 0,
			replies: [],
			is_delete: true,
		}

		// Action
		const detailComment = new DetailComment(payload)

		// Assert
		expect(detailComment.content).toBe('**komentar telah dihapus**')
	})

	it('should create DetailComment entities correctly', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			username: 'dicoding',
			content: 'sebuah komentar',
			date: '2024-12-07T01:44:58.491Z',
			replies: [],
			likeCount: 0,
		}

		// Action
		const detailComment = new DetailComment(payload)

		// Assert
		expect(detailComment).toBeInstanceOf(DetailComment)
		expect(detailComment.id).toEqual(payload.id)
		expect(detailComment.username).toEqual(payload.username)
		expect(detailComment.content).toEqual(payload.content)
		expect(detailComment.date).toEqual(payload.date)
		expect(detailComment.replies).toEqual(payload.replies)
	})
})
