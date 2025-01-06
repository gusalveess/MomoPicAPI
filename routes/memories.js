const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { uri, title, description, date, location } = req.body;

    const query = `
        INSERT INTO memories (uri, title, description, date, location)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    
    try {
        const result = await req.app.locals.pool.query(query, [uri, title, description, date, location]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar memória:', err);
        res.status(500).json({ message: 'Erro ao criar memória' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM memories WHERE id = $1 RETURNING *;';

    try {
        const result = await req.app.locals.pool.query(query, [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Memória não encontrada' });
        }

        res.status(200).json({ message: 'Memória deletada com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar memória:', err);
        res.status(500).json({ message: 'Erro ao deletar memória' });
    }
});

router.get('/', async (req, res) => {
    
    try {
        const result = await req.app.locals.pool.query('SELECT * FROM memories');

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar as memórias:', error);
        res.status(500).json({ error: 'Erro ao buscar as memórias' });
    }
});

module.exports = router;