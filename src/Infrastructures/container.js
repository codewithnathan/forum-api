/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository')
const PasswordHash = require('../Applications/security/PasswordHash')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const CommentRepository = require('../Domains/comments/CommentRepository')
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres')
const ReplyRepository = require('../Domains/replies/ReplyRepository')
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres')

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase')
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase')
const GetThreadUseCase = require('../Applications/use_case/GetThreadUseCase')
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase')
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase')
const UpdateLikeUseCase = require('../Applications/use_case/UpdateLikeUseCase')
const LikeRepository = require('../Domains/likes/LikeRepository')
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres')

// creating container
const container = createContainer()

// registering services and repository
container.register([
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: ThreadRepository.name,
		Class: ThreadRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: CommentRepository.name,
		Class: CommentRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: ReplyRepository.name,
		Class: ReplyRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: LikeRepository.name,
		Class: LikeRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
	{
		key: AuthenticationTokenManager.name,
		Class: JwtTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt.token,
				},
			],
		},
	},
])

// registering use cases
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: AddThreadUseCase.name,
		Class: AddThreadUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
			],
		},
	},
	{
		key: GetThreadUseCase.name,
		Class: GetThreadUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'replyRepository',
					internal: ReplyRepository.name,
				},
				{
					name: 'likeRepository',
					internal: LikeRepository.name,
				},
			],
		},
	},
	{
		key: AddCommentUseCase.name,
		Class: AddCommentUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
			],
		},
	},
	{
		key: DeleteCommentUseCase.name,
		Class: DeleteCommentUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
			],
		},
	},
	{
		key: AddReplyUseCase.name,
		Class: AddReplyUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'replyRepository',
					internal: ReplyRepository.name,
				},
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
			],
		},
	},
	{
		key: DeleteReplyUseCase.name,
		Class: DeleteReplyUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'replyRepository',
					internal: ReplyRepository.name,
				},
			],
		},
	},
	{
		key: UpdateLikeUseCase.name,
		Class: UpdateLikeUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'likeRepository',
					internal: LikeRepository.name,
				},
			],
		},
	},
	{
		key: LoginUserUseCase.name,
		Class: LoginUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LogoutUserUseCase.name,
		Class: LogoutUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
			],
		},
	},
	{
		key: RefreshAuthenticationUseCase.name,
		Class: RefreshAuthenticationUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
			],
		},
	},
])

module.exports = container
