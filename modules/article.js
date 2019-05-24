import Sequelize from 'sequelize'
import dbConfig from '../config/db'

//引入Sequelize对象
const sequelize = new Sequelize(dbConfig)
const Op = Sequelize.Op
//引入文章数据表模型
const Article = sequelize.import('../schema/article')
const Category = sequelize.import('../schema/category')
const Tag = sequelize.import('../schema/tag')
const ArticleTag = sequelize.import('../schema/article_tag')

Category.hasMany(Article) // 将会添加 category_id 到 ArticleModel 模型
Article.belongsTo(Category, {foreignKey: 'categoryId'})

Article.belongsToMany(Tag, {
    through: {
        model: ArticleTag,
        unique: false,
    },
    foreignKey: 'article_id', //通过外键postId
    constraints: false
});
Tag.belongsToMany(Article, {
    through: {
        model: ArticleTag,
        unique: false,
    },
    foreignKey: 'tag_id', //通过外键tagId
    constraints: false
});

Article.sync({force: false})
ArticleTag.sync({force: false})

class ArticleModel {
    /**
     * 创建文章
     * @param data 创建文章的参数
     * @returns {Promise<void>}
     */
    static async create(params) {
        //例如我们tag表有2条数据，[{id:1,name:'标签1'},{id:2,name:'标签2'}]
        //传递进来的data = {name:'文章1',tagIds:[1,2]}
        //let params = {title, author, introduction, categoryId, tag, cover, content}
        let newArticle = await Article.create(params) //返回创建的post对象

        let {tag} = params
        let arr = tag.split('|')
        let tags = await Tag.findAll({where: {id: arr}})//找到对应的tagId对象
        await newArticle.setTags(tags) //通过setTags方法在postTag表添加记录
        return newArticle
        //以上操作会给Article表创建一条新的记录，{id:1,name:'文章1'}
        //给ArticleTag表添加2条记录,[{id:1,postId:1,tagId:1},{id:2,post:1,tagId:2}]
    }
    // static async create(data) {
    //     return await Article.create(data)
    // }

    /**
     * 更新文章数据
     * @param id 文章ID
     * @param data 文章更新的属性参数
     */
    static async update(id, params) {
        //id为需要修改的ID,data = {name:'修改文章',tagIds:[1]}
        let {tag} = params
        let arr = tag.split('|') || []
        let tags = await Tag.findAll({where: {id: arr}})
        let oldArticle = await Article.findByPk(id)
        let newArticle = await oldArticle.update(params)
        let data = await newArticle.setTags(tags)

        return data
    }

    /**
     * 搜索文章
     * @param params keyword 关键字
     *
     * @returns  返回匹配文章标题的文章列表数据
     */
    static async search(params) {
        let {page = 1, page_size = 10, keyword} = params
        let ret = await Article.findAndCountAll({
            limit: Number(page_size),//每页10条
            offset: (page - 1) * Number(page_size),
            where: {
                title: {
                    // 模糊查询
                    [Op.like]: '%' + keyword + '%'
                },
                is_del: 0
            },
            include: [
                {model: Category, where: {categoryId: Sequelize.col('article.categoryId')}},
                {model: Tag, attributes: ['id', 'name']}
            ],
            'order': [
                ['id', 'DESC']
            ],
            attributes: {exclude: ['content']}
        })


        return {
            data: ret.rows,
            meta: {
                current_page: parseInt(page),
                page_size: Number(page_size),
                count: ret.count,
                total: ret.count,
                total_pages: Math.ceil(ret.count / 10),
            }
        }
    }

    /**
     * 获取文章列表
     * @returns {Promise<*>}
     */
    static async list(params) {
        let ret = null
        let {page = 1, page_size = 10, category_id, title, include} = params


        let exclude = include === 'is_del' ? ['content'] : ['content', 'is_del']
        let isShowIsDel = include === 'is_del' ? 1 : 0

        if (category_id) {
            console.log('//////////////////////')
            console.log(category_id)
            ret = await Article.findAndCountAll({
                limit: Number(page_size),//每页10条
                offset: (page - 1) * Number(page_size),
                where: {
                    categoryId: category_id,
                    is_del: isShowIsDel ? [0, 1] : [0]
                },
                include: [
                    {model: Category, attributes: {exclude: ['id', 'createdAt', 'updatedAt']}},
                    {model: Tag, attributes: ['id', 'name']}
                ],
                'order': [
                    ['id', 'DESC']
                ],
                attributes: {exclude: exclude}
            })
        } else if (title) {
            ret = await Article.findAndCountAll({
                limit: Number(page_size),//每页10条
                offset: (page - 1) * Number(page_size),
                where: {
                    title,
                    is_del: isShowIsDel ? [0, 1] : [0]
                },
                include: [
                    {model: Category, attributes: {exclude: ['id', 'createdAt', 'updatedAt']}},
                    {model: Tag, attributes: ['id', 'name']}
                ],
                'order': [
                    ['id', 'DESC']
                ],
                attributes: {exclude: exclude}
            })

        } else {
            ret = await Article.findAndCountAll({
                limit: Number(page_size),//每页10条
                offset: (page - 1) * Number(page_size),
                'order': [
                    ['id', 'DESC']
                ],
                where: {
                    is_del: isShowIsDel ? [0, 1] : [0]
                },
                include: [
                    {model: Category, attributes: {exclude: ['id', 'createdAt', 'updatedAt']}},
                    {model: Tag, attributes: ['id', 'name']}
                ],
                attributes: {exclude: exclude}
            })
        }
        console.log(ret)
        return {
            list: ret.rows,
            meta: {
                current_page: parseInt(page),
                page_size: Number(page_size),
                count: ret.count,
                total: ret.count,
                total_pages: Math.ceil(ret.count / 10),
            }
        }
    }

    /**
     * 获取文章详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async detail(id) {
        return await Article.findOne({
            where: {
                id,
                is_del: 0
            },
            include: [
                {model: Category, where: {categoryId: Sequelize.col('article.categoryId')}},
                {model: Tag, attributes: ['id', 'name']}
            ],
            attributes: {exclude: ['is_del']}
        })
    }

    /**
     * 软删除文章（隐藏文章）
     * @param id 文章ID
     * @param data 文章ID
     */
    static async hidden(id, data) {
        return await Article.update(data, {
            where: {
                id,
            },
            fields: ['is_del']
        })
    }
}

export default ArticleModel