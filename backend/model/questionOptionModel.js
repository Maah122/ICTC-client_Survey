const pool = require("../db");

// Get questions with their assigned options by type
const getQuestionsByType = async (type) => {
  const result = await pool.query(
    `SELECT q.id AS question_id, q.text AS question_text, q.survey_id, o.id AS option_id, o.text AS option_text
     FROM "CSS"."question_option" qo
     JOIN "CSS"."question" q ON qo.question_id = q.id
     JOIN "CSS"."option" o ON qo.option_id = o.id
     WHERE q.type = $1
     ORDER BY q.survey_id, q.id, o.id;`,
    [type]
  );
  return result.rows;
};

const getQuestionWithOptionsById = async (questionId) => {
  const result = await pool.query(
    `SELECT q.id AS question_id, q.text AS question_text, q.survey_id, o.id AS option_id, o.text AS option_text
     FROM "CSS"."question_option" qo
     JOIN "CSS"."question" q ON qo.question_id = q.id
     JOIN "CSS"."option" o ON qo.option_id = o.id
     WHERE q.id = $1
     ORDER BY q.survey_id, o.id;`,
    [questionId]
  );
  return result.rows;
};


module.exports = { getQuestionsByType, getQuestionWithOptionsById };
