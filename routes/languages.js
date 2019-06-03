import express from 'express';
import load from '../client/index.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./index', {title: 'Choose Languages', template: load});
})

export default router;
