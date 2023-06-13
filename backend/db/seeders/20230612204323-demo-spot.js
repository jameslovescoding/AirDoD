'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      { // id: 1
        ownerId: 1,
        address: '285 Third St',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States of America',
        lat: 42.3628172,
        lng: -71.0838024,
        name: 'A luxury unit at Third Square Apartments',
        description: 'A 1 bedrooms and 1 bathrooms unit in a luxury apartmen complet',
        price: 255.0
      },
      { // id: 2
        ownerId: 1,
        address: '180 Halsted Dr',
        city: 'Hingham',
        state: 'MA',
        country: 'United States of America',
        lat: 42.2531756,
        lng: -70.9179026,
        name: 'A condo facing the sea',
        description: 'A 2,153 square foot condo with 2 bedrooms and 2.5 bathrooms',
        price: 158.0
      },
      { // id: 3
        ownerId: 2,
        address: '89 Rogers Farm Rd',
        city: 'Vineyard Haven',
        state: 'MA',
        country: 'United States of America',
        lat: 41.4490873,
        lng: -70.6085112,
        name: 'A tiny house on Martha\'s Vineyard island',
        description: 'A 1 bedrooms and 1 bathrooms town house on Martha\'s Vineyard island',
        price: 199.0
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: [
          'A luxury unit at Third Square Apartments',
          'A condo facing the sea',
          'A tiny house on Martha\'s Vineyard island'
        ]
      }
    }, {});
  }
};
