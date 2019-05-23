import jwt from 'jsonwebtoken'
const util = require('util')
const verify = util.promisify(jwt.verify)
import config from '../config'

export const createToken = async info => {
    const token = await jwt.sign(info, config.TOKEN_KEY, {
        expiresIn: config.TOKEN_EXPIRESIN
    })
    return token
}

const decodeTokens = async ctx => {
    const token = ctx.header.token
    if(! token){
        ctx.status = 403
        ctx.body = {
            code: 403,
            msg: '您还没有登录'
        }
        return
    }
    const user = await verify(token, config.TOKEN_KEY)
    return user
}
export const decodeToken = decodeTokens

export const checkAuth = async ctx => {
    const user = await decodeTokens(ctx)
    if(user && user.username){
        return true
    }else{
        ctx.status = 200
        ctx.body = { code: 1, message: '您无权限进行此操作' }
        return false
    }
}
