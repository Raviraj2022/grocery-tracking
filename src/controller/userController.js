// const express = require("express")
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
// const bcrypt = require("bcrypt")
// const jwt = require('jsonwebtoken')
// const User = require("../models/User")

export const userRegister = async(req, res)=>{

    try{
        const{userName, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({userName, password: hashedPassword, role})
        await user.save();

        res.status(201).json({message: "User is registered"});
    }
    catch(error){
        res.status(500).json({error: "User is not registered"});
    }

}

export const userLogin = async(req, res)=>{
    try {
        const JWT_SECRET = "ggitrtyyt43w4567654"
        const { userName, password } = req.body;
    // console.log(userName, password);
    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

     // Generate JWT Token
     const token = jwt.sign(
        { id: user._id, role: user.role },
         JWT_SECRET, 
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
}

// module.exports = {userRegister, userLogin}