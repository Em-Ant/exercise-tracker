
const formatDate = d => new Date(d)
.toLocaleString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const filterLog = (log, from, to, count) => {
  let _exercises = log;
  if (from) _exercises = _exercises.filter(e => new Date(e.date) >= new Date(from));
  if (to) _exercises = _exercises.filter(e => new Date(e.date) <= new Date(to));
  if (count) _exercises = _exercises.slice(0, count);
  return _exercises;
}

module.exports = {
  filterLog,
  formatDate
}