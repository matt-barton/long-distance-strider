module.exports = (req, res, next) => {
  console.log('TODO: auth_middleware');
  if (true || req.user && req.user.authenticated) return next();
  res.redirect('/login');
};