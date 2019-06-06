import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./meetingsadm', {title: 'Administrate meeting'});
})

export default router;