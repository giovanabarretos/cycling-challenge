const fs = require('fs').promises;
const path = require('path');

class PasscodeModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/example-passcodes.json');
  }

  async getAllPasscodes() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data).passcodes;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw error;
    }
  }

  async validatePasscode(code) {
    const passcodes = await this.getAllPasscodes();
    return passcodes.find(p => p.code === code && p.active);
  }
}

module.exports = new PasscodeModel();