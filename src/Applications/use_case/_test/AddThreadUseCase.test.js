const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
	it('should orchestrating the add thread action correctly', async () => {
		const userId = 'user-123'
		const useCasePayload = {
			title: 'sebuah thread',
			body: 'isi thread',
		}

		const mockAddedThread = {
			id: 'thread-123',
			title: useCasePayload.title,
			owner: 'dicoding',
		}

		const mockThreadRepository = new ThreadRepository()

		mockThreadRepository.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedThread))

		const addThreadUseCase = new AddThreadUseCase({
			threadRepository: mockThreadRepository,
		})

		const addedThread = await addThreadUseCase.execute(
			userId,
			useCasePayload
		)

		expect(addedThread).toStrictEqual({
			id: 'thread-123',
			title: useCasePayload.title,
			owner: 'dicoding',
		})

		expect(mockThreadRepository.addThread).toBeCalledWith(
			userId,
			new NewThread(useCasePayload)
		)
	})
})
