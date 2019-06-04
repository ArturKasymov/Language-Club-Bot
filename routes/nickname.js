import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./index', {nickname: true, title: 'Nickname'});
})

export default router;
