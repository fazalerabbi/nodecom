var express       = require('express');
var morgan        = require('morgan');
var mongoose      = require('mongoose');
var bodyParser    = require('body-parser');
var ejs           = require('ejs');
var engine        = require('ejs-mate');
var session       = require('express-session');
var cookieParser  = require('cookie-parser');
var flash         = require('express-flash');
var MongoStore    = require('connect-mongo/es5')(session);
var passport      = require('passport');
var ejsLocals     = require('ejs-locals');


var config = require('./config/config');
var User = require('./models/user');
var category = require('./models/category');

var app = express();

mongoose.connect(config.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secretKey,
  store: new MongoStore({ url: config.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

//to add categories in nav bar we add middleware that queries from db and save in local variable

/*app.use(function(req, res, next){
  category.find({}, function(err, categories){
    res.locals.categories = categories;
    next();
  })
});*/

app.engine('ejs', engine);
app.set('view engine', 'ejs');


var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.listen(config.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on port " + config.port);
});
