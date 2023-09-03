const express = require('express');
const router = express.Router();
const db = require('../queries/userQueries')

router.get('/', db.getUsers)
router.get('/:id', db.getUserById)

module.exports = router