const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt); // turn scrypt into a promise based function

class UsersRepository {
  // check and see if filename given
  // then checks if file repo exists, else creates it in directory where program was run
  // NB! synchronous methods used since they'll only run once on program bootup
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  // -- METHODS --
  // -------------

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async create(attrs) {
    // atrs -> signup object {email: '', password: ''}

    // random id
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(16).toString('hex');
    const buff = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    // spread attrs object into a new object, then overwrite password with hashed + salt
    const record = {
      ...attrs,
      password: `${buff.toString('hex')}-${salt}`,
    };
    records.push(record);

    // write record array back to this.filename
    await this.writeAll(records);

    // return attrs object for login purposes
    return record;
  }

  async comparePasswords(saved, supplied) {
    // saved -> password saved in database 'hashed-salt'
    // supplied -> password given by user when signing in

    const [hashed, salt] = saved.split('-'); // destructure split array
    const hashedSuppliedBuff = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuff.toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((records) => records.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);

    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((records) => records.id === id);

    if (!record) {
      throw new Error(`>> Record with id of ${id} not found`);
    }

    // Object.assign method copies all enumerable own properties from source objects to a target object
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  // filters is an object containing what to look for
  // get all records
  // go through records and
  // see if they match any key in filters
  // if found return record
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository('users.json');
