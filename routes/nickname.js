import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./nickname', {title: 'Nickname'});
})

export default router;
