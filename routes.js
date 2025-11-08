import express from  'express';
import mssql from 'mssql';

const router = express.Router();

//Routes (API Endpoints)
//GET/api/shows/
router.get('/', (req, res) => {
    //Create some sample show data 
   await sql.connect(/*import db server etc here*/)

   const result = awit sql.query `select`
  res.json(shows);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send('Show Details for Show ID: ${id}');

    const show = {id: id, title: 'sample show', description: 'This is a sample description'}
})
export default router;
