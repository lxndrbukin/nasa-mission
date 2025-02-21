function getPagination(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 0);
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}

module.exports = { getPagination };
