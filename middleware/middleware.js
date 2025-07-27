function checkAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

function checkRole(role) {
  return function (req, res, next) {
    if (req.session.role !== role) {
      return res.status(403).send('Access Denied');
    }
    next();
  };
}
module.exports = {checkAuth,checkRole}