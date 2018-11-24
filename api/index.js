const router = require('express').Router();
const path = require('path');
const Datastore = require('nedb');
const validate = require('./validate');

const {filterLog, formatDate} = require('./helpers');

const baseDir = path.normalize(`${__dirname}/..`);
const db = new Datastore({
  filename: path.join(baseDir, 'db'),
  autoload: true
});

router.post('/exercise/new-user',validate.user, (req, res, next) => {
  const { username } = req.body;
  db.insert({ username, log: [] }, (err, user) => {
    if (err) return next(err);
    const {username, _id} = user; 
    res.json({username, _id});
  });
});

router.post('/exercise/add', validate.exercise, (req, res, next) => {
  const {userId, date, ...exercise} = req.body;
  db.findOne({_id: userId}, (err, user) => {
    if (err) return next(err);
    if (!user) return res.send('Unknown user id');
    const {_id, username, log} = user;
    if (date) {
      exercise.date = date;
    } else {
      const now = new Date;
      const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      exercise.date = today;
    }
    log.unshift(exercise)
    const sortedLog = log.sort((a, b) => new Date(b.date) - new Date(a.date));
    db.update({_id: userId}, {$set: {log: sortedLog}}, {}, (err, updated) => {
      if (err || !updated) return next(err);
      return res.json({_id, username, ...exercise, date: formatDate(exercise.date)});
    });
  });
});

router.get('/exercise/log', validate.log, (req, res, next) => {
  const {userId, limit, from, to} = req.query;
  db.findOne({_id: userId}, (err, user) => {
    if (err) return next(err);
    if (!user) return res.send('Unknown user id');
    let {log} = user;
    log = filterLog(log, from, to, limit)
      .map(e => ({...e, date: formatDate(e.date)}));
    res.json({...user, count: log.length, log});
  });
});

router.use((err, _, res, next) => {
  if (err) {
    return res.status(err.status || 400)
      .type('text')
      .send(err.message || 'bad request');
  }
  next();
})

module.exports = router;

/* HyVOMhqfm  hN3rgERHZ37U86wR*/

// {"_id":"HJjELBmCQ","username":"___test","count":1,"log":[{"description":"vvvvv","duration":5,"date":"Wed Nov 21 2018"}]}