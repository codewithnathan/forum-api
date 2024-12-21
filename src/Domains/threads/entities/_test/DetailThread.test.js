const DetailThread = require('../DetailThread')

describe('DetailThread entities', () => {
	it('should throw error when payload not contain needed property', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			title: 'judul thread',
			body: 'body thread',
			date: '2024-12-07T01:44:58.491Z',
			username: 'dicoding',
		}

		// Action & Assert
		expect(() => new DetailThread(payload)).toThrowError(
			'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
		)
	})

	it('should throw error when payload not meet data type specification', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			title: 'judul thread',
			body: 'body thread',
			date: '2024-12-07T01:44:58.491Z',
			username: 123,
			comments: [],
		}

		// Action & Assert
		expect(() => new DetailThread(payload)).toThrowError(
			'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
		)
	})

	it('should create DetailThread entities correctly', () => {
		// Arrange
		const payload = {
			id: 'user-123',
			title: 'judul thread',
			body: 'body thread',
			date: '2024-12-07T01:44:58.491Z',
			username: 'dicoding',
			comments: [],
		}

		// Action
		const detailThread = new DetailThread(payload)

		// Assert
		expect(detailThread).toBeInstanceOf(DetailThread)
		expect(detailThread.id).toEqual(payload.id)
		expect(detailThread.title).toEqual(payload.title)
		expect(detailThread.body).toEqual(payload.body)
		expect(detailThread.date).toEqual(payload.date)
		expect(detailThread.username).toEqual(payload.username)
		expect(detailThread.comments).toEqual(payload.comments)
	})
})
