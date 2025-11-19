const ScheduleInterviewHandler = require('./handler');

module.exports = {
  getCandidates: ScheduleInterviewHandler.getCandidates.bind(ScheduleInterviewHandler),
  getScheduleInterviewById: ScheduleInterviewHandler.getScheduleInterviewById.bind(ScheduleInterviewHandler),
  createScheduleInterview: ScheduleInterviewHandler.createScheduleInterview.bind(ScheduleInterviewHandler),
  updateScheduleInterview: ScheduleInterviewHandler.updateScheduleInterview.bind(ScheduleInterviewHandler),
  deleteScheduleInterview: ScheduleInterviewHandler.deleteScheduleInterview.bind(ScheduleInterviewHandler),
};

