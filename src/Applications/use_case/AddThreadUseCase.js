const NewThread = require('../../Domains/threads/entities/NewThread')

class AddThreadUseCase {
	constructor({ threadRepository }) {
		this._threadRepository = threadRepository
	}
	async execute(userId, useCasePayload) {
		const thread = new NewThread(useCasePayload)

		const result = await this._threadRepository.addThread(
			userId,
			thread
		)

		return result
	}
}

module.exports = AddThreadUseCase
