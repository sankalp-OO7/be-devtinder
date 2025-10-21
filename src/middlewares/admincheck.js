const admincheck = (req, res, next) => {
  const auth = true;
  if (!auth) {
    res.status(403).send("Unauthorized");
    return;
  } else {
    console.log("In the admin middleware");
    next();
  }
};

module.exports = { admincheck };
