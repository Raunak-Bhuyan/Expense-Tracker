const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransactions = async (req, res) => {
  try {
    const { frequency, selectedDate, userid, type } = req.body;

    let filter = { userid };

    if (frequency !== 'custom') {
      filter.date = {
        $gt: moment().subtract(Number(frequency), 'd').toDate(),
      };
    } else if (selectedDate.length === 2) {
      filter.date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(selectedDate[1]),
      };
    }

    if (type !== 'all') {
      filter.type = type;
    }

    const transactions = await transactionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions:", error.message);
    res.status(500).json(error);
  }
};

const deleteTransaction = async (req,res) => {
  try{
    await transactionModel.findOneAndDelete({_id:req.body.transactionId})
    res.status(200).send('deleted successfully');
  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
};

const editTransaction = async (req,res) => {
  try{
    await transactionModel.findOneAndUpdate({_id:req.body.transactionId}, 
      req.body.payload
    );
    res.status(200).send('Edited successfully');
  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
};

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();
    res.status(201).send('Transaction Created');
  } catch (error) {
    console.log("Error adding transaction:", error.message);
    res.status(500).json(error);
  }
};

module.exports = { getAllTransactions, addTransaction, editTransaction, deleteTransaction };
