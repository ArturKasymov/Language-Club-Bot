import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./index', {first_time: true, title: 'Registration'});
})

export default router;
