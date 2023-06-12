'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'ReviewImages';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      { // id: 1
        reviewId: 1,
        url: '/review/image/1/1'
      },
      { // id: 2
        reviewId: 2,
        url: '/review/image/2/1'
      },
      { // id: 3
        reviewId: 3,
        url: '/review/image/3/1'
      },
      { // id: 4
        reviewId: 4,
        url: '/review/image/4/1'
      },
      { // id: 5
        reviewId: 1,
        url: '/review/image/1/2'
      },
      { // id: 6
        reviewId: 1,
        url: '/review/image/1/3'
      },
      { // id: 7
        reviewId: 2,
        url: '/review/image/2/2'
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
