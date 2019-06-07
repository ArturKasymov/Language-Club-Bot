import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./history', {SERVER_URL: process.env.SERVER_URL, title: 'History'});
});

export default router;