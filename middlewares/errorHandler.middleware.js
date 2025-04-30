module.exports = (err, req, res, next) => {
  // console.error(err);
  const status = err.status || 500;

  if (err.name == "SequelizeValidationError") {
    const errors = {};

    err.errors.forEach((e) => {
      if (errors[e.path] == undefined) {
        errors[e.path] = [];
      }

      errors[e.path].push(e.message);
    });

    res.status(400).json({ message: "Validation Error", errors });
  } else {
    res.status(status).json({ message: err.message });
  }
};
