const express = require('express');

const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');


// INITIALIZATIONS
const app = express();
require('./database');
require('./config/passport');


// SETTINGS
app.set('port', 9000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
      defaultLayout: 'main',
      layoutsDir: path.join(app.get('views'), "layouts"),
      partialsDir: path.join(app.get('views'), "partials"),
      extname: '.hbs'
}));
app.set('view engine', '.hbs');



// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
      secret: 'mySecretApp',
      resave: true,
      saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// GLOBAL VARIABLES
app.use((req, res, next) => {
      res.locals.success_message = req.flash('success_message');
      res.locals.error_message = req.flash('error_message');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;

      next();
});


// ROUTES
app.use(require('./routes/index.routes'));
app.use(require('./routes/games.routes'));
app.use(require('./routes/users.routes'));


// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
      console.log(`http://localhost:${app.get('port')}`);
});