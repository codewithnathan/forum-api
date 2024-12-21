const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads',
		handler: handler.postThreadHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
	{
		method: 'POST',
		path: '/threads/{id}/comments',
		handler: handler.postCommentHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
	{
		method: 'GET',
		path: '/threads/{id}',
		handler: handler.getThreadHandler,
	},
	{
		method: 'DELETE',
		path: '/threads/{thread_id}/comments/{comment_id}',
		handler: handler.deleteCommentHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
	{
		method: 'POST',
		path: '/threads/{thread_id}/comments/{comment_id}/replies',
		handler: handler.postReplyHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/threads/{thread_id}/comments/{comment_id}/replies/{reply_id}',
		handler: handler.deleteReplyHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
	{
		method: 'PUT',
		path: '/threads/{thread_id}/comments/{comment_id}/likes',
		handler: handler.updateLikeHandler,
		options: {
			auth: 'forum-api_jwt',
		},
	},
]

module.exports = routes
