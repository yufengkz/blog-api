import Sequelize from 'sequelize'
import dbConfig from '../config/db'
//引入Sequelize对象
const sequelize = new Sequelize(dbConfig)
//引入文章数据表模型
const Tag = sequelize.import('../schema/tag')

//自动创建表
Tag.sync({
    force: false
})

//创建文章模型
class TagModel {
    //创建用户
    static async create(params){
        return await Tag.create(params)
    }

    //查询
    static async detail(id){
        return await Tag.findOne({
            where: {
                id
            }
        })
    }    
}

export default TagModel