import parseParagraphToJSON from 'lib/parse-paragraph-to-json';

/**
 * @todo: move this functions if they are use somewhere else than EVP
 */

/**
 * @param notebooksBody
 * @param reportName
 * @returns {*}
 */
export const getZeppelinNoteBookReportIdId = (notebooksBody, reportName) => {
  const reports = notebooksBody.filter(el => el.name === reportName);

  if (reports && reports.length) {
    return reports[0].id;
  }

  return false;
};

/**
 * @param reportData
 * @param paragraphIndex
 * @returns {*}
 */
export const getZeppelinDataFromReport = (reportData, paragraphIndex) => {
  if (!reportData) {
    return [];
  }

  const paragraphs = reportData.paragraphs;
  if (!paragraphs || !paragraphs[paragraphIndex]) {
    return [];
  }

  const results = paragraphs[paragraphIndex].results;
  if (!results || !Object.keys(results).length || results.code === 'ERROR') {
    return [];
  }

  const data = results.msg[0].data;
  if (!data) {
    return [];
  }

  return parseParagraphToJSON(data);
};
