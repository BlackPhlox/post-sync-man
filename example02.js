let util = eval(globals.lib)();

util.lib_check()

function formatRequestCustom(url,method,body) {
    return util.formatRequest(url,method, 
    {
        'content-Type': "application/json",
        'api_key': pm.environment.get("name_of_your_api_key")
    },
    body);
}

console.log(formatRequestCustom("www.test.com","GET",undefined));
