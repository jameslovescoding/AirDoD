'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      { // id: 1
        spotId: 1,
        userId: 2,
        review: 'Very nice and very comfortable.',
        stars: 5,
      },
      { // id: 2
        spotId: 2,
        userId: 3,
        review: 'Feel good but quite expensive for what you got.',
        stars: 4,
      },
      { // id: 3
        spotId: 3,
        userId: 4,
        review: 'The room is fine but the neighborhood is not safe.',
        stars: 2,
      },
      { // id: 4
        spotId: 3,
        userId: 1,
        review: 'Wonderful experience. Definitely recommened.',
        stars: 5,
      },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
