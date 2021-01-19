/* globals describe, expect, it */
var pathToUrl = require("../path-to-url");

describe("pathToUrl", function () {
  it("converts Windows paths to a url path", function () {
    var urlPath = pathToUrl("\\Foo\\bar\\baz");
    expect(urlPath).toEqual("/Foo/bar/baz");
  });

  it("does not affect unix paths", function () {
    var unixPath = pathToUrl("/Foo/bar/baz/");
    expect(unixPath).toEqual("/Foo/bar/baz/");
  });

  it("normalizes path segments", function () {
    var joinedPath = pathToUrl("/", "//Foo", "bar", "baz/");
    expect(joinedPath).toEqual("/Foo/bar/baz/");
  });
});
