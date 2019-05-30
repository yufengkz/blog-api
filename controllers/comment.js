import CommentModel from '../modules/comment'
// import CategoryModel from '../modules/category'

class CommentController {
    /**
     * 创建留言
     * @param {article} ctx 
     */
    static async create(ctx){
        let params = ctx.request.body
        try {
            const res = await CommentModel.create(params)
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `留言成功`,
                data: {
                    content: res.content,
                    article_id: res.article_id,
                    id: res.id
                }
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `留言失败，请重试`
            }
        }
    }
    /**
     * 创建回复
     * @param {params} ctx 
     */
    static async createReply(ctx){
        let params = ctx.request.body
        try {
            const data = await CommentModel.createReply(params)
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `回复成功`,
                data
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `回复失败，请重试`
            }
        }
    }

    /**
     * 获取留言
     */
    static async list (ctx){
        let params = ctx.query
        if(! params.id) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `ID不能为空`
            }
        }
        try {
            const data = await CommentModel.list(params)
            ctx.status = 200
            ctx.body = {
                code: 0,
                msg: `查询成功`,
                data
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `查询留言失败`
            }
        }

    }
}

export default CommentController