import express from  'express';
import mssql from 'mssql';

const router = express.Router();

//Routes (API Endpoints)
//GET/api/shows/
router.get('/', async (req, res) => {
   
   await sql.connect('Server=localhost,1433; Database=master; User Id=sa; Password=57mJok51[fgN;TrustServerCertificate=True')
   
   const result = await sql.query `select * from mytable where id = ${value}`
   console.dir(result.recordset) //return the result as json

  res.json(shows);

});
//GEt: /api/shows/1
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Show Details for Show ID: ${id}`);

    const show = {id: id, title: 'sample show', description: 'This is a sample description'}

    res.json(show)
});
export default router;
