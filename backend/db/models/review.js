'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // User -> Review: one-to-many
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      // Spot -> Review: one-to-many
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })

      // Review -> ReviewImage: one-to-many
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId'
      })
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    review: {
      allowNull: false,
      type: DataTypes.STRING(500),
      validate: {
        len: [1, 500]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        max: 5,
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};