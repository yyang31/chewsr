const router = require('express').Router();
const controller = require('./controller');

router.get('/:group_id', controller.getGroupByID);

module.exports = router;