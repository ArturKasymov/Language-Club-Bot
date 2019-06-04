import express from 'express';
const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./index', {title: 'Choose Languages'});
})

export default router;
