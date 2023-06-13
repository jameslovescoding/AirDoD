'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'SpotImages';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      { // id: 1
        spotId: 1,
        url: '/spot-image/1/1',
        preview: true
      },
      { // id: 2
        spotId: 1,
        url: '/spot-image/1/2',
        preview: false
      },
      { // id: 3
        spotId: 1,
        url: '/spot-image/1/3',
        preview: false
      },
      { // id: 4
        spotId: 2,
        url: '/spot-image/2/1',
        preview: true
      },
      { // id: 5
        spotId: 2,
        url: '/spot-image/2/2',
        preview: false
      },
      { // id: 6
        spotId: 2,
        url: '/spot-image/2/3',
        preview: false
      },
      { // id: 7
        spotId: 3,
        url: '/spot-image/3/1',
        preview: true
      },
      { // id: 8
        spotId: 3,
        url: '/spot-image/3/2',
        preview: false
      },
      { // id: 9
        spotId: 3,
        url: '/spot-image/3/3',
        preview: false
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};
