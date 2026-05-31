const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from a PDF file buffer.
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
async function parsePDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Could not parse PDF resume. The file may be corrupt or encrypted.');
  }
}

/**
 * Extracts raw text from a DOCX file buffer.
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
async function parseDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Could not parse DOCX resume. The file may be corrupt or invalid.');
  }
}

/**
 * Main parser entry point. Detects file type from extension and delegates.
 * @param {string} filePath 
 * @returns {Promise<string>}
 */
async function extractTextFromFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const extension = filePath.split('.').pop().toLowerCase();

  if (extension === 'pdf') {
    return await parsePDF(fileBuffer);
  } else if (extension === 'docx') {
    return await parseDOCX(fileBuffer);
  } else if (extension === 'doc') {
    // Fallback or read as text if it's formatted as text, or return descriptive message
    // Note: Legacy binary .doc is hard to parse in pure JS. We extract visible ASCII text as a fallback.
    try {
      const text = fileBuffer.toString('utf8');
      // Strip non-ASCII/printable characters to extract some text
      const cleanText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      return cleanText;
    } catch (e) {
      throw new Error('Legacy .DOC files are not fully supported. Please convert your resume to PDF or .DOCX format.');
    }
  } else if (extension === 'txt') {
    return fileBuffer.toString('utf8');
  } else {
    throw new Error(`Unsupported file format: .${extension}. Please upload a PDF, DOCX, or TXT file.`);
  }
}

module.exports = {
  extractTextFromFile
};
