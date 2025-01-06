const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { madeBy, description, deadline, status } = req.body;

    const query = `
        INSERT INTO promises (madeBy, description, deadline, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        const result = await req.app.locals.pool.query(query, [madeBy, description, deadline, status]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar promessa' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM promises WHERE id = $1 RETURNING *;';

    try {
        const result = await req.app.locals.pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Promessa não encontrada' });
        }

        res.status(200).json({ message: 'Promessa deletada com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao deletar promessa' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await req.app.locals.pool.query('SELECT * FROM promises');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar as promessas:', error);
        res.status(500).json({ error: 'Erro ao buscar as promessas' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    const query = `
        UPDATE promises
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;

    try {
        const result = await req.app.locals.pool.query(query, [status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Promessa não encontrada' });
        }

        res.status(200).json({ message: 'Status atualizado com sucesso', promise: result.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar o status da promessa:', err);
        res.status(500).json({ message: 'Erro ao atualizar o status da promessa' });
    }
});


module.exports = router;