const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev/data/tours.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const body = req.body;

  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { newTour } });
    }
  );
};

exports.checkId = (req, res, next) => {
  if (!+req.params.id || +req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
exports.getAllTours = getAllTours;
exports.getTour = getTour;
exports.createTour = createTour;
