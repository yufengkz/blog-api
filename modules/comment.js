import Sequelize from 'sequelize'
import dbConfig from '../config/db'

//引入Sequelize对象
const sequelize = new Sequelize(dbConfig)
//引入文章数据表模型
const Comment = sequelize.import('../schema/comment')
const Reply = sequelize.import('../schema/reply')
const CommentReply = sequelize.import('../schema/comment_reply')

Reply.belongsToMany(Comment, {
    through: {
        model: CommentReply,
        unique: false,
    },
    foreignKey: 'reply_id', //
    constraints: false
})
Comment.belongsToMany(Reply, {
    through: {
        model: CommentReply,
        unique: false,
    },
    foreignKey: 'comment_id', //通过外键tagId
    constraints: false
})

Comment.sync({force: false})
Reply.sync({force: false})
CommentReply.sync({force: false})

class CommentModel{
    //创建留言
    static async create (params){
        return await Comment.create(params)
    }
    //创建一条回复
    static async createReply (params){
        let {content, article_id, comment_id, username, email, mobile} = params
        let newReply = await Reply.create({content, article_id, username, email, mobile}) //创建一条心得评论

        let reply_id = newReply.id
        let doc = {
            reply_id, article_id, comment_id
        }

        await CommentReply.create(doc)
        return newReply
    }

    //获取留言
    static async list (params){
        let {page = 1, page_size = 10, id} = params
        let ret
        ret = await Comment.findAndCountAll({
            limit: Number(page_size),//每页10条
            offset: (page - 1) * Number(page_size),
            where: {
                article_id: id
            },
            include: [
                {model: Reply, attributes: {exclude: ['id', 'comment_reply']}},
            ],
        })
        console.log(ret)
        return {
            list: ret.rows,
            meta: {
                current_page: parseInt(page),
                page_size: Number(page_size),
                //count: ret.count,
                //total: ret.count,
                //total_pages: Math.ceil(ret.count / 10),
            }
        }
    }
}

export default CommentModel