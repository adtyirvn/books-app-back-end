const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
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

  // Validate input
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Init book
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Add new book
  books.push(newBook);

  // Check if new book was added
  const isSuccess = books.filter((b) => b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // If fail to add new book
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditampilkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = [...books];
  // Filtered from query name
  if (name) {
    filteredBooks = filteredBooks.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  // Filtered from query reading
  if (reading) {
    filteredBooks = filteredBooks.filter(
      (b) => b.reading === !!Number(reading)
    );
  }
  // Filtered from query finished
  if (finished) {
    filteredBooks = filteredBooks.filter(
      (b) => b.finished === !!Number(finished)
    );
  }
  // Response appropriate data obj format with filtered array from query or without query
  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // Get book obj value if bookId and id book obj match
  const book = books.filter((b) => b.id === bookId)[0];
  // If book object not undefined return book obj value filter
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  // If bookId not match
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
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
  // Find index form books array if bookId match with book id obj
  const index = books.findIndex((b) => b.id === bookId);
  // If book obj index found
  if (index !== -1) {
    // Validate input
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const finished = pageCount === readPage;
    // Set new value to updatedAt
    const updatedAt = new Date().toISOString();
    // Update book obj with corresponding index
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // If bookId not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // Find index form books array if bookId match with book id obj
  const index = books.findIndex((b) => b.id === bookId);
  // If book obj index found
  if (index !== -1) {
    // Remove obj from array books with corresponding index
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // If bookId bot found
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooks,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
