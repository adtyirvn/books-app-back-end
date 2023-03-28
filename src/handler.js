const { nanoid } = require('nanoid');
const books = require('./books');

const id = nanoid(16);
const insertedAt = new Date().toISOString();
const updatedAt = insertedAt;
let finished = false;
const addBookHandler = (request, h) => {
  if (request.payload.name !== undefined) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    if (readPage <= pageCount) {
      if (readPage === pageCount) {
        finished = true;
      }
    } else {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    // const newBook = {
    //   id,
    //   name,
    //   year,
    //   author,
    //   summary,
    //   publisher,
    //   pageCount,
    //   readPage,
    //   finished,
    //   reading,
    //   insertedAt,
    //   updatedAt,
    // };
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

module.exports = { addBookHandler };
