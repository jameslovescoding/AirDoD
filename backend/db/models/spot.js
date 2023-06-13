'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // User -> Spot: one-to-many
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });

      // Spot -> Booking: one-to-many
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });

      // Spot -> Review: one-to-many
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });

      // Spot -> SpotImage: one-to-many
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });

      // Spot -> User: many-to-many, through Booking, as spotAdmins,
      // use spot.getSpotAdmins() to perform query
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId',
        as: 'spotAdmins'
      });

      // Spot -> User: many-to-many, through Review, as spotCommenters
      // use spot.getSpotCommenters() to perform query
      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: 'spotId',
        otherKey: 'userId',
        as: 'spotCommenters'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};