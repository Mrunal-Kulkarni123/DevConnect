const AdminAuth = (req, res, next) => {
  const token = "HareKrishna";
  const isAdminAuthorized = token === "HareKrishna";
  if (!isAdminAuthorized) {
    res.status(400).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  AdminAuth,
};
