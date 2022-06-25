    module.exports = class <Class-Name> extends Sequelize.Model {
        static init(sequelize) {
            return super.init({
                <Column-Name>: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: '<Model-Name>',
                tableName: '<Table-Name>',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            });
        }

        static associate(db) {

        }
    };