module.exports = function(err, req, res, next) {
  const stringifiedErr = JSON.stringify(err);
  console.log(err)
  if (err.status === 404) {
    const errors = [`${err.resource} not found !`]
    res.status(err.status).json({
      errors  
    });
  } else if (stringifiedErr.indexOf('ValidatorError') !== -1) {
    const mongooseErrors = err.errors;
    const errors = [];
    
    for (let key in mongooseErrors) {
      errors.push(mongooseErrors[key].message);
    }
    res.status(400).json({ errors });
  } else if (stringifiedErr.indexOf('E11000') !== -1) {
    let errors = null;
    if (stringifiedErr.indexOf('email') !== -1) {
      errors = ['Email is already in use'];
    } else {
      errors = ['Username is already in use'];
    }
    res.status(400).json({ errors });
  } else if(err.status === 400 || err.status === 401) {
    let errors = [err.message]
    res.status(err.status).json({ errors })
  } else {
    console.log(err)
    res.status(500).json({
      message: 'Internal server error, check the console',
    });
  }
};