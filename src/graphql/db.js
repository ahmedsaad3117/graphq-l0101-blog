const users = [
  {
    id: 1,
    name: "Sara",
    email: "sara@example.com",
    password: "123456",
    age: 18,
  },
  {
    id: 2,
    name: "Adam",
    email: "adam@example.com",
    password: "654321",
    age: 22,
  },
  {
    id: 3,
    name: "James",
    email: "james@example.com",
    password: "qwertyu",
    age: 19,
  },
];

const db = { users };

module.exports = {
  db,
};
