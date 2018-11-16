if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: mongodb://<user>:<dbpass1>@ds039291.mlab.com:39291/crud_db}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
