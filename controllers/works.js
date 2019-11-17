import WorkModel from '../modules/works'

class WorkController {
    // 创建作品
    static async create(ctx) {
        // 接收参数
        let { title, introduction, cover, content, url } = ctx.request.body

        let params = { title, introduction, cover, content, url }
        console.log('==========-----')

        // 检测参数是否存在为空
        let errors = []
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            ctx.response.status = 0
            ctx.body = {
                code: 1,
                message: errors
            }
            return false
        }
        try {
            // 创建作品
            let { id } = await WorkModel.create(params)
            console.log(id)

            let data = await WorkModel.detail(id)
            console.log(data)

            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `创建作品成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `创建作品失败`,
                data: err
            }
        }

    }
    // 删除作品
    static async delete(ctx) {
        let { id } = ctx.params
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
            await WorkModel.hidden(id)
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `删除成功`
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
    /**
     * 更新修改数据
     * @param ctx title            文章标题
     * @param ctx introduction     文章简介
     * @param ctx categoryId       文章分类ID
     * @param ctx tag              文章标签
     * @param ctx cover            文章封面
     * @param ctx content          文章内容
     *
     * @returns 更新成功则返回更新后的文章数据，失败返回更新失败的原因
     */
    static async update(ctx) {
        let { id } = ctx.params

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
        // 接收参数
        let { title, introduction, cover, content, url } = ctx.request.body

        let params = { title, introduction, cover, content, url }

        try {
            let a = await WorkModel.update(id, params)
            console.log(a)
            let data = await WorkModel.detail(id)
            console.log(data)

            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `更新作品成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `更新作品失败`,
                data: err
            }
        }
    }
    /**
     * 查询作品详情
     * @param ctx id  文章ID
     *
     * @returns 作品的详情
     */
    static async detail(ctx) {
        console.log('----------------------')
        console.log(ctx)
        // 作品ID
        let { id } = ctx.params

        // 检测是否传入ID
        if (!id) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `作品ID为空，请传入查询的作品ID`
            }

            return false
        }

        if (isNaN(id)) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `请传入正确的作品ID`
            }

            return false
        }

        try {

            let data = await WorkModel.detail(id)

            // if (data !== null) {
            //     // 浏览次数增加1
            //     let browser = data.browser + 1
            //     await ArticleModel.update(id, {
            //         browser
            //     })
            // }

            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `查询作品成功`,
                data
            }

        } catch (err) {
            ctx.response.status = 200
            ctx.body = {
                code: 1,
                message: `查询作品失败`,
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
        let {include} = ctx.query

        try {
            let data = await WorkModel.list()
            
            ctx.response.status = 200
            ctx.body = {
                code: 0,
                message: `获取作品列表成功！`,
                list: data
            }

        } catch (err) {
            ctx.response.status = 500
            ctx.body = {
                code: 1,
                message: `获取作品列表失败`,
                data: err
            }
        }
    }
}

export default WorkController

