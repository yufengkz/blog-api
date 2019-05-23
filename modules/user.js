import Sequelize from 'sequelize'
import dbConfig from '../config/db'
//引入Sequelize对象
const sequelize = new Sequelize(dbConfig)
//引入文章数据表模型
const User = sequelize.import('../schema/user')
//自动创建表
User.sync({
    force: false
})

//创建文章模型
class UserModel {
    //创建用户
    static async createUser(params){
        let {username, email, password} = params
        return await User.create({
            username, email, password
        })
    }

    //查询用户
    static async username(username){
        return await User.findOne({
            where: {
                username
            },
            //过滤不必要的数据
            attributes: {
                //exclude: 'password'
            }
        })
    }

    //查询所有用户
    static async getUserList(){
        return await User.findAndCountAll({
            //过滤不必要的数据
            attributes: {
                exclude: 'password'
            }
        })
    }

    //删除用户
    static async delUser(id){
        return await User.destroy({
            where: {
                id
            }
        })
    }
    
}

export default UserModel