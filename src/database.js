const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/games-db-app', {
  
})
      .then(db => console.log('DB is connected'))
      .catch(error => console.log(error))
