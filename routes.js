import express from 'express';
import sql from 'mssql';

const router = express.Router();


// GET /api/shows/
router.get('/', async (req, res) => {
  try {
    await sql.connect("Server=localhost,1433; Database=master; User Id=sa; Password=57mJok51[fgN;TrustServerCertificate=True");
    const result = await sql.query(`
      SELECT s.ShowID, s.Title AS ShowTitle, s.FileName, s.Description, s.ShowTime,
             s.Owner, c.CategoryId, c.CategoryName, v.VenueId, v.VenueName
      FROM dbo.show s
      INNER JOIN dbo.Category c ON s.CategoryId = c.CategoryId
      INNER JOIN dbo.Venue v ON s.VenueId = v.VenueId
      ORDER BY s.ShowTime
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/shows/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await sql.connect("Server=localhost,1433; Database=master; User Id=sa; Password=57mJok51[fgN;TrustServerCertificate=True");
    const result = await sql.query(`
      SELECT * FROM dbo.show WHERE ShowID = ${id}
    `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching show:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//helper function for masking the Credit Card Number
function maskCardNumber(cardNumber) {
  const num = cardNumber.toString().replace(/\D/g, '');
  const last4 = num.slice(-4);
  return last4.padStart(num.length, '*');
}
// POST /api/shows/purchases
router.post('/purchases', async (req, res) => {
  const purchase = req.body;

//  validating proper JSON
  if (!purchase || typeof purchase !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON structure.' });
  }

  //Validating required fields
  const requiredFields = [
    'NumTicketsOrdered', 'CustFirstName', 'CustLastName', 'CustEmail',
    'PhoneNumber', 'Address', 'CreditCardType', 'CreditCardNumber',
    'ExpirationDate', 'CVV', 'ShowId'
  ];

  const missingFields = requiredFields.filter(field => !purchase[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required field(s): ${missingFields.join(', ')}`
    });
 }

  try {
    await sql.connect("Server=localhost,1433; Database=master; User Id=sa; Password=57mJok51[fgN;TrustServerCertificate=True");

    //Masking confidential information in the database
    const maskedCard = maskCardNumber(purchase.CreditCardNumber);
    const maskedCVV = "***"; 
    
    await sql.query`
      INSERT INTO Purchase (
        NumTicketsOrdered, CustFirstName, CustLastName, CustEmail,
        PhoneNumber, Address, CreditCardType, CreditCardNumber,
        ExpirationDate, CVV, ShowId, PurchaseDate
      ) VALUES (
        ${purchase.NumTicketsOrdered}, ${purchase.CustFirstName}, ${purchase.CustLastName}, ${purchase.CustEmail},
        ${purchase.PhoneNumber}, ${purchase.Address}, ${purchase.CreditCardType}, ${purchase.CreditCardNumber},
        ${purchase.ExpirationDate}, ${purchase.CVV}, ${purchase.ShowId}, GetDate()
      )
    `;

    res.status(201).json({ message: 'Purchase recorded successfully.' });
  } catch (err) {
    console.error('Error inserting purchase:', err);
    res.status(500).json({ error: 'Internal server error. '+ err });
  }
});


export default router;