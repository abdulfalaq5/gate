const CandidatesHandler = require('./handler');

module.exports = {
  getCandidates: CandidatesHandler.getCandidates.bind(CandidatesHandler),
  getCandidateById: CandidatesHandler.getCandidateById.bind(CandidatesHandler),
  createCandidate: CandidatesHandler.createCandidate.bind(CandidatesHandler),
  updateCandidate: CandidatesHandler.updateCandidate.bind(CandidatesHandler),
  deleteCandidate: CandidatesHandler.deleteCandidate.bind(CandidatesHandler),
};

