const Ad = require('./../models/adModel');
class Features {
  query = Ad.find();
  constructor(queryS) {
    this.queryS = queryS;
  }

  filter() {
    const queryObject = { ...this.queryS };

    ['page', 'fields', 'sort', 'limit'].forEach((q) => delete queryObject[q]);
    let stringy = JSON.stringify(queryObject);
    stringy = JSON.parse(
      stringy.replace(/\b(gte|gt|lt|lte)\b/, (match) => `$${match}`)
    );
    this.query = this.query.find(stringy);
    return this;
  }
  sort() {
    if (this.queryS.sort) {
      this.query = this.query.sort(this.queryS.sort);
    }
    return this;
  }
  fields() {
    if (this.queryS.fields) {
      console.log(
        '-------------------------------------------------------------'
      );
      const brutFields = this.queryS.fields.split(',').join(' ');
      this.query = this.query.select(brutFields);
    }
    return this;
  }
  paginate() {
    if (this.queryS.page) {
      const limit = +this.queryS.limit;
      if (+this.queryObject.page <= 0) return;
      const skip = +this.queryS.page - 1 * limit;
      const docsNum = Ad.count({}, (err, count) => count);
      if (skip > docsNum) return;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = Features;
