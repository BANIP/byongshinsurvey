var mongoose = require('mongoose');
var megaloResult = new mongoose.Schema({
    great: Number,
    good: Number,
    miss: Number,
    score: Number,
    allScore: Number,
    playerRank: String,
    percent: Number,
    combo: Number,
    id: String,
    channelImg: String,
    name: String,
    date: {type: Date, default: Date.now }
});

//surveySchema.index({id:1})
module.exports = mongoose.model('MegaloResult', megaloResult);