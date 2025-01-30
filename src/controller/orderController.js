import express from "express"
import Order from "../models/Order.js"


export const getHistory = async(req, res)=>{
try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}