const InterviewHandler = require('./handler')

module.exports = {
  getCandidates: InterviewHandler.getCandidates.bind(InterviewHandler),
  getInterviewById: InterviewHandler.getInterviewById.bind(InterviewHandler),
  createInterview: InterviewHandler.createInterview.bind(InterviewHandler),
  updateInterview: InterviewHandler.updateInterview.bind(InterviewHandler),
  deleteInterview: InterviewHandler.deleteInterview.bind(InterviewHandler)
}

