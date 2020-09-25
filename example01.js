let util = eval(globals.lib)();

util.lib_check()

console.log(util.formatRequest("www.test.com", "get"));
