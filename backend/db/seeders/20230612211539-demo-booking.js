'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      { // id: 1
        spotId: 1,
        userId: 2,
        startDate: '2023-05-14',
        endDate: '2023-05-18'
      },
      { // id: 2
        spotId: 2,
        userId: 3,
        startDate: '2023-05-31',
        endDate: '2023-06-05'
      },
      { // id: 3
        spotId: 3,
        userId: 4,
        startDate: '2023-06-12',
        endDate: '2023-06-21'
      },
      { // id: 4
        spotId: 3,
        userId: 1,
        startDate: '2023-06-18',
        endDate: '2023-06-30'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
