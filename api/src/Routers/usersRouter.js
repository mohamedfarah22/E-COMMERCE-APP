const express = require('express');
const router = express.Router();
const db = require('../queries/userQueries')

module.exports = (pool) => {


router.get('/', (req, res, next) =>{
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results.rows)
    })

})
router.get('/:id', async (req, res, next) => {
    const userId = req.params.id;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(rows);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
return router
}

