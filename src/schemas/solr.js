define([], function () {
  var schema = {
    query: {
      types: {
        and: 'q=AND((^.^))',
        or: 'q=OR((^.^))',
        regular: 'q=(^.^)'
      }
    },
    pageSize: 'rows=(^.^)',
    startPage: 'start=(^.^)'
  };

  return schema;
});
