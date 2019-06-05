import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./createmeeting', {title: 'Create Meeting'});
})

export default router;