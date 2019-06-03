import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./index', {title: 'Choose Languages'});
})

export default router;
