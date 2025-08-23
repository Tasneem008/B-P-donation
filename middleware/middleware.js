function checkAuth(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function checkRole(role) {
  return function (req, res, next) {
    if (req.session.role !== role) {
      return res.status(403).render("unauthorized");
    }
    next();
  };
}

// middleware/auth.js
function setUserData(req, res, next) {
  res.locals.isAuthenticated = req.session.userId ? true : false;
  res.locals.role = req.session.role || null;
  res.locals.userId = req.session.userId || null;
  next();
}

module.exports = { checkAuth, checkRole, setUserData };
