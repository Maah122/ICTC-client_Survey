const pool = require("../db.js");

const AnswerModel = {
  getAllAnswers: async () => {
    const result = await pool.query(`SELECT * FROM "CSS".answer ORDER BY id`);
    return result.rows;
  },

  getAnswersByOfficeAndSurvey: async (officeId, surveyId) => {
    const result = await pool.query(`
      SELECT a.*
      FROM "CSS".answer a
      JOIN "CSS".response r ON r.id = a.response_id
      WHERE r.office_id = $1 AND r.survey_id = $2
    `, [officeId, surveyId]);

    return result.rows;
  },

  getAnswersBySurvey: async (surveyId) => {
    const result = await pool.query(`
      SELECT a.*
      FROM "CSS".answer a
      JOIN "CSS".response r ON r.id = a.response_id
      WHERE r.survey_id = $1
    `, [surveyId]);

    return result.rows;
  },
  
};


module.exports = AnswerModel;

