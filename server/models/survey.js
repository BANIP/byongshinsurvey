var mongoose = require('mongoose');
var surveySchema = new mongoose.Schema({
  name: String,
  channelImg: String,
  id: String,
  content: String,
  date: {type: Date, default: Date.now }
});

//surveySchema.index({id:1})
module.exports = mongoose.model('SurveyQuestion', surveySchema);
