import Router from 'koa-router'
//文章Controller
import ArticleController from '../controllers/article'
//分类
import CategoryController from '../controllers/category'
//用户Controller
import UserController from '../controllers/user'
//标签Controller
import TagController from '../controllers/tag'
//评论、留言Controller
import CommentController from '../controllers/comment'

const router = new Router({
	prefix: '/api'
})

/**
 * 文章
 */
// 创建文章
router.post('/article/create', ArticleController.create)
// 获取文章详情
router.get('/article/detail/:id', ArticleController.detail)
// 删除文章
router.delete('/article/hidden/:id', ArticleController.hidden)
// 更改文章
router.put('/article/update/:id', ArticleController.update)
// 获取文章列表
router.get('/article/list', ArticleController.list)
// 搜索文章
router.get('/article/search', ArticleController.search)

/**
 * 分类
 */
// 创建分类
router.post('/category/create', CategoryController.create)
// 获取分类详情
router.get('/category/detail/:id', CategoryController.detail)
// 删除分类
router.delete('/category/delete/:id', CategoryController.delete)
// 更改分类
router.put('/category/update/:id', CategoryController.update)
// 获取分类列表
router.get('/category/list', CategoryController.list)
// 查询分类ID下的所有文章列表
router.get('/category/article/:id', CategoryController.article)

/**
 * 标签tag
 */
//创建分类
router.post('/tag/create', TagController.create)
// 查询详情
router.get('/tag/detail/:id', TagController.detail)

/**
 * 评论、留言
 */
//创建留言
router.post('/comment/create', CommentController.create)
//创建留言
router.post('/comment/createReply', CommentController.createReply)
//获取留言
router.get('/comment/list', CommentController.list)

/**
 * 用户
 */
//创建用户
router.post('/createUser', UserController.createUser)
//删除用户
router.delete('/delUser', UserController.delUser)
//查询用户
router.post('/getUser', UserController.getUser)
//查询所有用户
router.post('/getUserList', UserController.getUserList)
//用户登录
router.post('/login', UserController.login)



export default router