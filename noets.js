var uriComponentsOrder: ['scheme', 'username', 'password', 'host', 'port', 'path']
var uriSchema = {
  scheme: '(^.^)://'
  username: '(^.^)',
  password: ':(^.^)',
  host: '(^.^)',
  port: ':(^.^)',
  path: '/(^.^)'
}
var defaultUriOptions = {
  scheme: 'http',
  username: '',
  password: '',
  host: 'www.isondev.net',
  port: '8080',
  path: ''
}
var uriOptions = {
  port: 4545
};

var solrQuerySchema = {
  query: {
    types: {
      and: 'q=AND((^.^))',
      or: 'q=OR((^.^))',
      regular: 'q=(^.^)'
    }
  },
  pageSize: 'rows=(^.^)'
};

var defaultOptions = {
  query: {
    value: 'ison developers',
    type: 'reqular'
  },
  pageSize: 20
};

//User configurations
var options = {
  query: {
    value: 'This is my second search query',
    type: 'and'
  },
  pageSize: 35
};

var qb =  new QueryBuilder.getInstance(solrQuerySchema);
qb.makeQuery(options);
