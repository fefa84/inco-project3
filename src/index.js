const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const crypto = require('crypto');




app.use(express.static(path.join(__dirname, '../public/images')));//odniesienie do folderu, w którym jest plik index.js!!!!  join służy do obsługi kompatybilności między systemami(chodzi o różny zapis ścieżek w róznych systemach)// można też użyć sieżki app.use('/', express.static('./')), która sprawi, że będzie dostęp do wszytskich plków i folderów
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 



app.set('views', './views');
app.set('view engine', 'pug');


const { users } = require("./data.js");
const { schedules } = require("./data.js");


//app.get('/', (req, res) => {
//   res.send') 
// })

app.get('/', function (req, res) {
  res.render('index', { title: 'Welcome', message: 'Welcome to our schedule website' })
})

app.get('/users', (req, res) => {
  res.render('users', );
})

app.get('/schedules', (req, res) => {
  res.send(schedules);
})

app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  res.send(users[userId]);//
})

app.get('/users/:userId/schedules', (req, res) => {
  const { userId } = req.params;
  let userSchedules = [];
  schedules.forEach(schedule => {
    if (schedule.user_id === parseInt(userId)) {
      userSchedules.push(schedule);
    }
  })

  if (userSchedules.length > 0) {
    res.json(userSchedules);
  } else {
    res.status(400).json({ message: `No user with an usid of ${req.params.userId}` })
  }
})

app.post('/schedules', (req, res) => {

  const newSchedule = {
    user_id: req.body.user_id,
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  }

  schedules.push(newSchedule);
  res.json(schedules)
})
//curl -d "user_id=4&day=2&start_at=2PM&end_at=5PM" -X POST localhost:3000/schedules


app.post('/users', (req, res) => {

  const newUser = {
    'firstname': req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  }
  newUser.password = crypto.createHash('sha256')
    .update('newUser.password')
    .digest('hex');
  users.push(newUser);
  res.json(users)
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
