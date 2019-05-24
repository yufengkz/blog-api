const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tag', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        // 分类名字
        name: {
            type: DataTypes.STRING(100),
            field: 'name',
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            field: 'updated_at',
            defaultValue: DataTypes.NOW,
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        }
    }, {
        freezeTableName: true
    })
}