const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户名字
        username: {
            type: DataTypes.STRING(100),
            field: 'username',
            allowNull: false
        },
        // 用户密码
        password: {
            type: DataTypes.STRING(100),
            field: 'password',
            allowNull: false
        },
        // 用户邮箱
        email: {
            type: DataTypes.STRING(100),
            field: 'email',
            allowNull: false
        },
        // 用户头像
        avatar: {
            type: DataTypes.TEXT,
            field: 'avatar',
            defaultValue: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        },
        // 用户头图
        top_img: {
            type: DataTypes.TEXT,
            field: 'top_img',
            defaultValue: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
        },
        // 用户昵称
        nick_name: {
            type: DataTypes.TEXT,
            field: 'nick_name',
            allowNull: false,
            defaultValue: ''
        },
        // 介绍
        introduce: {
            type: DataTypes.TEXT,
            field: 'introduce',
            defaultValue: ''
        },
        // 技能
        skills: {
            type: DataTypes.TEXT,
            field: 'skills',
            default: null
        },
        // 其他
        others: {
            type: DataTypes.TEXT,
            field: 'others',
            default: null
        },
        // 爱好
        favorite: {
            type: DataTypes.TEXT,
            field: 'favorite',
            default: null
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_id',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_id',
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
/*
CREATE TABLE IF NOT EXISTS `user`(
    `id` INT UNSIGNED AUTO_INCREMENT COMMENT '主键(自增长)',
    `username` VARCHAR(100) NOT NULL COMMENT '用户姓名',
    `password` VARCHAR(100) NOT NULL COMMENT '用户密码',
    `email` VARCHAR(100) NOT NULL COMMENT '用户密码',
    `createdAt` DATE COMMENT '创建时间',
    `updatedAt` DATE COMMENT '更新时间',
    PRIMARY KEY ( `id` )
 )COMMENT = '用户表' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */