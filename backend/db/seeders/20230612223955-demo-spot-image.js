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
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-637090369513451459/original/1782d9d6-4a11-4d4b-b416-69c18e363f5a.jpeg?im_w=1200',
        preview: true
      },
      { // id: 2
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-637090369513451459/original/21f887b0-13a1-4e61-b8db-0cb53d1ff245.jpeg?im_w=1200',
        preview: false
      },
      { // id: 3
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-637090369513451459/original/4821a099-5816-4fa3-8c78-9a367a3e4315.jpeg?im_w=1440',
        preview: false
      },
      { // id: 4
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-32668074/original/c1922bc6-bc5f-4094-ad69-22029c5ef32b.jpeg?im_w=1200',
        preview: true
      },
      { // id: 5
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-32668074/original/c0e97e1a-e0ee-4bd8-86a2-031d9b967e09.jpeg?im_w=1200',
        preview: false
      },
      { // id: 6
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-32668074/original/392ec24b-9ca9-4e25-b1a8-a0dd07d15f2a.jpeg?im_w=1200',
        preview: false
      },
      { // id: 7
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-750680187341064029/original/3d24724f-ac91-406d-8c84-59a57e243bd0.jpeg?im_w=1200',
        preview: true
      },
      { // id: 8
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-750680187341064029/original/bbe0b692-4318-4b45-9556-498b61d9714c.jpeg?im_w=1440',
        preview: false
      },
      { // id: 9
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-750680187341064029/original/d0122af9-2e90-4ffa-9ed0-d8ceac60ef43.jpeg?im_w=1440',
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
