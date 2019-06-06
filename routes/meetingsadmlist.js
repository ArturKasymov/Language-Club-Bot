import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./meetingsadmlist', {title: 'Meetings List'});
})

export default router;