import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('./futuremeetings', {title: 'Future meetings'});
});

export default router;
