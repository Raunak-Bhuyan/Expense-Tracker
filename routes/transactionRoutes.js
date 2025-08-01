const express = require('express')
const { addTransaction, getAllTransactions, editTransaction, deleteTransaction} = require('../controllers/transactionCtrl')

//router object
const router = express.Router()

//routes
//add transaction
router.post('/add-transaction', addTransaction)

//edit transaction
router.put('/edit-transaction', editTransaction)

//delete transaction
router.delete('/delete-transaction', deleteTransaction)

//get transactions
router.get('/get-transactions', getAllTransactions)

module.exports = router;