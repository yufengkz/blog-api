const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_tag', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            field: 'tag_id',
            allowNull: false
        },
        article_id: {
            type: DataTypes.INTEGER,
            field: 'article_id',
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