const fs = require('fs');

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
  async getAll() {
    // open file called x.filename
    const contents = await fs.promises.readFile(this.filename, {
      encoding: 'utf8',
    });
    // read contents
    console.log(contents);
    // parse contents
    // return parsed data
  }
}

// TESTS
const test = async () => {
  const repo = new UsersRepository('users.json');
  await repo.getAll();
};

test();
