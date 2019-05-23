import CategoryModel from '../modules/category'
import {createToken, checkAuth} from '../lib/token'

class CategoryController {
    /**
     * 创建分类
     * @param ctx name         分类名称
     * @param ctx icon         分类icon图标
     * @param ctx z_index      权重
     *
     * @returns 成功创建分类返回分类详情数据，失败返回错误信息
     */
    static async create(ctx) {
        let {name, icon, z_index} = ctx.request.body

        let params = {name, icon}
        console.log(params)

        // 检测参数是否存在为空
        let errors = []
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }
        if (errors.length > 0) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: errors
            }
            return false
        }


        try {
            params.z_index = z_index || '10'
            const {id} = await CategoryModel.create(params)
            const data = await CategoryModel.detail(id)

            ctx.response.status = 200
            ctx.body = {
                code: 200,
                message: `创建分类成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `创建分类失败`,
                data: err
            }
        }

    }

    /**
     * 获取分类列表
     * @params ctx include 包含内容
     *
     * @returns 分类列表数据
     */
    static async list(ctx) {
        let {
            include
        } = ctx.query

        try {
            let data = await CategoryModel.list()
            
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `获取分类列表成功！`,
                data
            }

        } catch (err) {
            ctx.response.status = 500
            ctx.body = {
                code: 1,
                message: `获取分类列表失败`,
                data: err
            }
        }
    }


    /**
     * 查询ID分类下的所有文章
     *
     * @returns 文章列表数据
     */
    static async article(ctx) {
        let {id} = ctx.params

        // 检测是否传入ID
        if (!id) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `分类ID不能为空`
            }

            return false
        }

        if (isNaN(id)) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `请传入正确的分类ID`
            }
            return false
        }

        try {
            const data = await CategoryModel.article(id)

            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `查询成功！`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `获取分类列表失败`,
                data: err
            }
        }
    }

    /**
     * 查询分类详情数据
     * @param ctx id 分类ID
     *
     * @returns 分类详情
     */
    static async detail(ctx) {
        let {id} = ctx.params
        // 检测是否传入ID
        if (!id) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `ID不能为空`
            }

            return false
        }

        if (isNaN(id)) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `请传入正确的ID`
            }

            return false
        }

        try {
            let data = await CategoryModel.detail(id)
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `查询成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `获取分类列表失败`,
                data: err
            }
        }
    }


    /**
     * 删除分类数据
     * @param ctx
     *
     * @returns 删除成功返回true，失败返回错误信息
     */
    static async delete(ctx) {
        let {id} = ctx.params
        let isAuth = await checkAuth(ctx)
        console.log(`isAuth:::` + isAuth)
        if(isAuth){
            // 检测是否传入ID
            if (!id) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    message: `ID不能为空`
                }
                return false
            }

            if (isNaN(id)) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    message: `请传入正确的ID`
                }

                return false
            }

            try {
                // 检测改分类下是否有文章关联，如果有文章关联则报出不能删除错误
                let hasArticle = await CategoryModel.article(id)

                if (hasArticle && hasArticle[0].articles.length > 0) {
                    ctx.response.status = 200
                    ctx.body = {
                        code: 1,
                        message: `此分类下有关联文章，不能删除`
                    }

                    return false

                } else {
                    await CategoryModel.delete(id)
                    ctx.response.status = 200
                    ctx.body = {
                        code: 0,
                        message: `删除成功`
                    }
                }

            } catch (err) {
                ctx.response.status = 200
                ctx.body = {
                    code: 1,
                    message: `删除失败`,
                    data: err
                }
            }
        }
    }

    /**
     * 更新分类数据
     * @param ctx id 文章分类ID
     * @param ctx name         分类名称
     * @param ctx icon         分类icon图标
     * @param ctx z_index      权重
     *
     * @returns 更新成功返回更新后的数据，失败返回错误信息
     */
    static async update(ctx) {
        let {id} = ctx.params

        // 检测是否传入ID
        if (!id) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `ID不能为空`
            }

            return false
        }

        if (isNaN(id)) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `请传入正确的ID`
            }

            return false
        }

        let {name, icon, z_index = 10
        } = ctx.request.body
        let params = {
            name,
            icon,
            z_index
        }

        try {

            await CategoryModel.update(id, params)
            let data = await CategoryModel.detail(id)

            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `更新分类成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `更新失败`,
                data: err
            }
        }


    }
}

export default CategoryController