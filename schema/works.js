const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('works', {
        // 作品ID
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        // 作品标题
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'title',
        },
        // 文章介绍
        introduction: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'introduction'
        },
        // 文章封面
        cover: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'cover'
        },
        // 文章内容
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'content'
        },
        // 地址
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'url'
        },
        // 浏览次数
        browser: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'browser',
            defaultValue: 0
        },
        // 是否软删除
        is_del: {
            type: DataTypes.BOOLEAN,
            field: 'is_del',
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
            get() {
                return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
            }
        },
        update_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'update_at',
            get() {
                return moment(this.getDataValue('update_at')).format('YYYY-MM-DD');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })

}