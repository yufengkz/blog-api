import UserModel from '../modules/user'
import bcrypt from 'bcryptjs'
import {createToken, checkAuth} from '../lib/token'

class UserController {
    //查询用户
    static async getUser(ctx) {
        let {username, id} = ctx.request.body
        if(! username) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                msg: `不传参数 ，你知道你要查谁？`
            }
            return
        }

        const isAuth = await checkAuth(ctx)
        //if(isAuth){
            try {
                let data = await UserModel.username(username)
                if (!data) {
                    ctx.response.status = 200
                    ctx.body = {
                        code: 1,
                        msg: `未查到该用户`,
                        data: {}
                    }
                    return
                }
                ctx.response.status = 200
                ctx.body = {
                    code: 0,
                    msg: `查询成功`,
                    data
                }
            } catch (err) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    msg: `查询用户失败`,
                    data: err
                }
            }
        //}
    }
    
    //查询所有用户
    static async getUserList(ctx) {
        const isAuth = await checkAuth(ctx)
        if(isAuth){
            try {
                let data = await UserModel.getUserList()
                
                ctx.response.status = 200
                ctx.body = {
                    code: 0,
                    msg: `查询成功`,
                    data
                }
            } catch (err) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    msg: `查询用户失败`,
                    data: err
                }
            }
        }
    }

    //创建用户
    static async createUser(ctx) {
        let {username, email, password,} = ctx.request.body
        let params = { username, email, password}
        //校验参数为空
        let errs = []
        for(let item in params){
            if(params[item] == undefined){
                let index = errs.length + 1
                errs.push(`错误${index}:参数${item}不能为空`)
            }
        }
        if(errs.length){
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: errs
            }
            return
        }
        //查询用户名是否重复
        const exisUser = await UserModel.username(params.username)
        if(exisUser){
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: '该用户已经存在'
            }
            return
        }else{
            try {
                //加密
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(params.password, salt)
                params.password = hash
                
                //创建用户
                await UserModel.createUser(params)
                ctx.response.status = 200
                ctx.body = {
                    code: 0,
                    msg: `创建用户成功`
                }
            } catch (err) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    msg: `创建用户失败`,
                    data: err
                }
            }
        }
    }

    //删除用户
    static async delUser(ctx){
        let {id} = ctx.request.body
        try {
            await UserModel.delUser(id)
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                msg: `删除用户成功`,
                data
            }
        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                msg: `删除用户失败`,
                data: err
            }
        }
    }

    //用户登录
    static async login(ctx) {
        const {username, password} = ctx.request.body
        //查询用户
        const userDetail = await UserModel.username(username)

        if(! userDetail){
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `用户不存在`
            }
            return
        }

        //判断当前密码与库里的密码是否一致
        if(bcrypt.compareSync(password, userDetail.password)){
            //生成token
            const userToken = {id: userDetail.id, email: userDetail.email, username: userDetail.username}
            const token = await createToken(userToken)
            ctx.status = 200
            ctx.body = {
                code: 0,
                msg: '登录成功',
                data: {
                    username: userDetail.username,
                    id: userDetail.id,
                    email: userDetail.email,
                    token: token
                }
            }
        }else{
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: '用户名或密码错误'
            }
        }
    }
}

export default UserController