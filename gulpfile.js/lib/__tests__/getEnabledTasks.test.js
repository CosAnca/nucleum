/* globals describe, expect, it, beforeEach, TASK_CONFIG, ENV */
var forEach = require("lodash/forEach");
var getEnabledTasks = require("../get-enabled-tasks");
var keys = require("lodash/keys");

describe("getEnabledTasks", function () {
  describe("when env == development", function () {
    beforeEach(function () {
      ENV = "development";
    });

    describe("#assetTasks", function () {
      beforeEach(function () {
        TASK_CONFIG = {
          fonts: true,
          images: true,
          icons: true,
        };
      });

      it("returns all tasks when none disabled", function () {
        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(["fonts", "images", "icons"]);
      });

      it("returns only enabled task when some disabled", function () {
        TASK_CONFIG["fonts"] = false;
        TASK_CONFIG["images"] = false;

        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(["icons"]);
      });

      it("returns false when all disabled", function () {
        forEach(keys(TASK_CONFIG), function (key) {
          TASK_CONFIG[key] = false;
        });

        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(false);
      });
    });

    describe("#codeTasks", function () {
      beforeEach(function () {
        TASK_CONFIG = {
          html: true,
          stylesheets: true,
          javascripts: true,
        };
      });

      it("returns all except javascripts when none disabled", function () {
        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(["html", "stylesheets"]);
      });

      it("returns only enabled except javascripts task when some disabled", function () {
        TASK_CONFIG["stylesheets"] = false;

        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(["html"]);
      });

      it("returns false when all disabled", function () {
        forEach(keys(TASK_CONFIG), function (key) {
          TASK_CONFIG[key] = false;
        });

        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(false);
      });
    });
  });

  describe("when env == production", function () {
    beforeEach(function () {
      ENV = "production";
    });

    describe("#assetTasks", function () {
      beforeEach(function () {
        TASK_CONFIG = {
          fonts: true,
          images: true,
          icons: true,
        };
      });

      it("returns all tasks when none disabled", function () {
        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(["fonts", "images", "icons"]);
      });

      it("returns only enabled task when some disabled", function () {
        TASK_CONFIG["fonts"] = false;
        TASK_CONFIG["icons"] = false;

        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(["images"]);
      });

      it("returns false when all disabled", function () {
        forEach(keys(TASK_CONFIG), function (key) {
          TASK_CONFIG[key] = false;
        });

        var tasks = getEnabledTasks(ENV);
        expect(tasks.assetTasks).toEqual(false);
      });
    });

    describe("#codeTasks", function () {
      beforeEach(function () {
        TASK_CONFIG = {
          html: true,
          stylesheets: true,
          javascripts: true,
        };
      });

      it("returns all and convert javascripts task when none disabled", function () {
        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual([
          "html",
          "stylesheets",
          "webpack:production",
        ]);
      });

      it("returns only enabled and convert javascripts task when some disabled", function () {
        TASK_CONFIG["stylesheets"] = false;

        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(["html", "webpack:production"]);
      });

      it("still correctly disable javascripts task when disabled", function () {
        TASK_CONFIG["javascripts"] = false;

        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(["html", "stylesheets"]);
      });

      it("returns false when all disabled", function () {
        forEach(keys(TASK_CONFIG), function (key) {
          TASK_CONFIG[key] = false;
        });

        var tasks = getEnabledTasks(ENV);
        expect(tasks.codeTasks).toEqual(false);
      });
    });
  });
});
