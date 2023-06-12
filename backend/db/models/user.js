'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // User -> Spot: one-to-many
      User.hasMany(models.Spot, { foreignKey: 'ownerId' });

      // User -> Booking: one-to-many
      User.hasMany(models.Booking, { foreignKey: 'userId' });

      // User -> Review: one-to-many
      User.hasMany(models.Review, { foreignKey: 'userId' });

      // User -> Spot: many-to-many, through Booking, as adminOf,
      // use user.getAdminOf() to perform query
      User.belongsToMany(models.Spot, {
        through: models.Booking,
        foreignKey: 'userId',
        otherKey: 'spotId',
        as: 'adminOf'
      });

      // User -> Spot: many-to-many, through Review, as commenterOf,
      // use user.getCommenterOf() to perform query
      User.belongsToMany(models.Spot, {
        through: models.Review,
        foreignKey: 'userId',
        otherKey: 'spotId',
        as: 'commenterOf'
      });

    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["firstName", "lastName", "hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};