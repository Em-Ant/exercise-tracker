const getDateError = date => {
  if (date && !/^\d{4}\-\d{2}\-\d{2}$/.test(date))
    return 'should be in format yyyy-mm-dd';
  if (date && !(new Date(date)))
    return 'should be a valid date';
}

const validate = {
  user(req, _, next) {
    const { username } = req.body;
    if (!username) {
      return next({message: 'username is required'});
    }
    next();
  },
  exercise(req, _, next) {
    const {userId, description, duration, date} = req.body;
    if (!userId) return next({message: 'userId is required'});
    if (!description) return next({message: 'description is required'});
    if (!duration) return next({message: 'duration is required'});
    if (!(parseInt(duration) > 0))
      return next({message: 'duration should be a positive number'});
    const dateError = getDateError(date);
    if (dateError) return next({message: `date ${dateError}`});
    next();
  },
  log(req, _, next) {
    const {userId, limit, from, to} = req.query;
    if (!userId) return next({message: 'userId is required'});
    if (limit && !(parseInt(limit) > 0))
      return next({message: 'duration should be a positive number'});
    const fromError = getDateError(from);
    if (fromError) return next({message: `from ${fromError}`});
    const toError = getDateError(to);
    if (toError) return next({message: `to ${toError}`});
    if (from && to && new Date(from) > new Date(to))
      return next({message: 'from should be before to'})
    next();
  }
};

module.exports = validate;