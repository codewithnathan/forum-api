const LikeRepository = require('../LikeRepository')

describe('LikeRepository interface', () => {
	it('should throw error when invoke abstract behavior', async () => {
		// Arrange
		const likeRepository = new LikeRepository()

		// Action and Assert
		await expect(likeRepository.addLike('', '')).rejects.toThrowError(
			'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
		)
		await expect(
			likeRepository.decreaseLike('', '')
		).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
		await expect(
			likeRepository.verifyAvailableLike('', '')
		).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
		await expect(
			likeRepository.getTotalLikeByCommentId('')
		).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
	})
})
