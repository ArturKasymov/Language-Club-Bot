import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./organizators', {title: 'Organizators'});
})

export default router;
