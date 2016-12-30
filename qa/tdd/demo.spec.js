import * as _ from 'underscore';
import { Fun } from '../../src/core/Fun.js';

describe('_.map', function () {
  it('should return an array made from...', function () {
    function sqr (a) { return a*a; };
    expect(_.isEqual(_.map([1, 2, 3], sqr), [1, 4, 9])).to.be.true;
  });
});

describe('generateString', function () {
  var result = Fun.generateString(Fun.always("a"), 10);
  it("should return a string of a specific length", function () {
    expect(typeof result).to.be.a('String');
    expect(result).to.have.length(10);
  });

  it("should return a string congruent with its char generator", function () {
    expect(result).to.equal("aaaaaaaaaa");
  });
});

describe('generateRandomCharacter', function () {
  var result = Fun.repeatly(1000, Fun.generateRandomCharacter);

  it('should return only strings of only lowercase ASCII letters or digits', function () {
    expect(_.every(result, _.isString)).to.be.true;
    expect(_.every(result, function (s) {
      return s.length === 1;
    })).to.be.true;
  });

  it("should return a string of only lowercase ASCII letters or digits", function() {
    expect(_.every(result, function (s) {
      return /[a-z0-9]/.test(s);
    })).to.be.true;
    expect(_.any(result, function (s) {
      return /[A-Z]/.test(s);
    })).to.be.false;
  });
});