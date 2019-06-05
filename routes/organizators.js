import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./organizators', {title: 'Users'});
})

export default router;
