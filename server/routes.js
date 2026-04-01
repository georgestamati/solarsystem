var express = require('express'),
	router = express.Router(),
	rows = require('./db'),
	records = rows.records;

// GET /api/planets — returns all planet/sun records
router.get('/api/planets', function (req, res) {
	res.json({
		title: rows.title,
		records: records
	});
});

// GET /api/planets/:planet — returns a single planet record by name
router.get('/api/planets/:planet', function (req, res) {
	var planet = records.find(function (r) {
		return r.name === req.params.planet;
	});

	if (planet) {
		res.json(planet);
	} else {
		res.status(404).json({ error: 'Planet not found: ' + req.params.planet });
	}
});

module.exports = router;
