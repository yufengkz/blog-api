import TagModel from '../modules/tag'
import {createToken, checkAuth} from '../lib/token'

class TagController {
    //创建
    static async create(ctx) {
        const name = ctx.request.body
        let params = {
            name
        }
        if (!params.name) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `请输入标签名称`
            }
        }
        try {
            //创建
            const {id} = await TagModel.create(params)
            console.log(id)
            //查询
            const data = await TagModel.detail(id)
            ctx.status = 200
            ctx.body = {
                code: 0,
                msg: `创建成功`,
                data
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `创建失败`
            }
        }
    }
    //查询
    static async detail(ctx){
        const {id} = ctx.params
        if(! id){
            ctx.status = 200
            ctx.body = {
                code: 1,
                msg: `标签id不能空`
            }
        }
        try {
            const data = await TagModel.detail(id)
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
                msg: `查询失败`
            }
        }
    }

    //查询所有tag
    static async list (ctx) {
        try {
            const data = await TagModel.list()
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
                msg: `查询失败`
            }
        }
    }
}

export default TagController