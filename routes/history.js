import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./history', {title: 'History'});
});

export default router;