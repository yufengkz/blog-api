import Sequelize from 'sequelize'
import dbConfig from '../config/db'

//引入Sequelize对象
const sequelize = new Sequelize(dbConfig)
//引入文章数据表模型
const Work = sequelize.import('../schema/works')
// 自动创建表
Work.sync({force: false})

class WorkModel {
    /**
     * 创建文章
     * @param params 创建作品的参数
     * @returns {Promise<void>}
     */
    static async create(params) {
        let data = await Work.create(params) //返回创建的post对象
        return data
    }

    /**
     * 删除作品 软删除
     * @param {id} id 
     */
    static async hidden(id) {
        return await Work.update({is_del: true}, {
            where: {
                id,
            },
            fields: ['is_del']
        })
    }

     /**
     * 更新文章数据
     * @param id 文章ID
     * @param data 文章更新的属性参数
     */
    static async update(id, params) {
        return await Work.update(params, {
            where: {
                id
            }
        })
    }

    /**
     * 获取作品详情数据
     * @param id  ID
     * @returns {Promise<Model>}
     */
    static async detail(id) {
        return await Work.findOne({
            where: {
                id,
                is_del: 0
            },
            include: [
               // {model: Category, where: {categoryId: Sequelize.col('article.categoryId')}},
            ],
            attributes: {exclude: ['is_del']}
        })
    }

    /**
     * 获取分类列表
     * @returns {Promise<*>}
     */
    static async list() {
        return await Work.findAll({
            attributes: ['id', 'title', 'introduction', 'cover', 'content', 'url'],
        })
    }
    
}

export default WorkModel