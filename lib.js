
postman.setGlobalVariable('lib', ()=> {
    checkEnvVars("base_url");
    checkEnvVars("HTTP_METHOD");
    pm.environment.set("url", pm.environment.get("base_url"));

    //Variables check
    function checkEnvVars(env){
        if(pm.environment.get(env) === undefined) {
            console.error("Remember you have to create or set an environment");
            throw new Error("Missing environment variable: " + env + " remember to set or add an environment");
        } else if (pm.environment.get(env) === ""){
            console.error("Remember you have to set some of the environment variables");
            throw new Error("Environment variable that has not been set: " + env );
        }
    }

    function err(str){
        throw new Error(" RB Library | Function : " + arguments.callee.caller.caller.name + " | Reason: " + str + " |");
    }

    //"undefined"
    //"object"
    //"boolean"
    //"number"
    //"bigint"
    //"string"
    //"symbol"
    //"function"
    //"object"
    //"array" added with Array.isArray()
    //"http_method"
    let types = ["undefined","object","boolean","number","bigint","string","symbol","function","object","array"];
    let methods_types = ["GET","PUT","POST","UPDATE","DELETE","PATCH"];
    function customStringTypeCheck(input,type,typeArrName,typeArr){
        if(type === typeArrName){
            if(!typeArr.some((t) => input.toLowerCase() === t.toLowerCase())){
                checkType(input,"string")
                err(`Type error : ${input} is not a valid ${type} keyword`)
            } 
            return;
        }
    }
    function checkType(input,type){
        //types.some((t) => console.log(t + " " + (t === type)));
        //types.some((t) => console.log(t + " " + (t === typeof input)));
        //console.log(types.some((t) => type == typeof input));
        customStringTypeCheck(input,type,"http_method",methods_types);
        if(!types.some((t) => t === type)) err("Invalid type def in checkType") 
        if(!types.some((t) => t === typeof input)) err("Unsupported type in checkType")
        if(type === "array" && Array.isArray(input)) {
            if(input.length) return;
            err("Array is empty");
        }
        if(!types.some((t) => type == typeof input)) err(`Type error : ${type} != ${typeof input}`)
    }

    function checkTypes(i_t_arr){
        checkType(i_t_arr,"array");
        i_t_arr.forEach((it) => checkType(it.i,it.t));
    }

    // Template methods

    // addAPIEndPoint("/agreement") -> "www.test.dk/api/agreement"
    function addAPIEndPoint(endpoint_sub_url){
        return pm.environment.get("base_url") + endpoint_sub_url;
    }

    // "www.test.dk/api/agreement" + query([{"type":"standard"}]) -> "www.test.dk/api/agreement?type=standard"
    function query(query_arr){
        checkType(query_arr,"array");
        let q = "?";
        for(let i = 0; i < query_arr.length; i++){
            let entry = Object.entries(query_arr[i])[0];
            q += entry[0] + "=" + entry[1];
            if(i != query_arr.length-1){
                q += "&";
            }
        }
        return q;
    }

    // Formats a postman request to be used with pm.sendRequest
    function formatRequest(url,method,headers,body){
        checkTypes([{i:url,t:"string"},{i:method,t:"http_method"}])
        let request = {
            url: url,
            method: method
        }
        if(headers !== undefined){
            request["header"] = headers
        }
        
        if(body !== undefined){
            request["body"] = {
                mode: 'raw',
                raw: JSON.stringify(body),
            }
        }
        return request;
    }

    function formatEnvRequest(url,method,body) {
        checkTypes([{i:url,t:"string"},{i:method,t:"http_method"}])
        pm.environment.set("url", url);
        pm.environment.set("HTTP_METHOD",method);
        if(body !== undefined){
            pm.environment.set("body", JSON.stringify(body));
        } else {
            pm.environment.set("body", undefined);
        }
    }

    return {
        lib_check : () => console.log("RB Library has been added to globals"),
        query : (q) => query(q),
        formatRequest: (url,method,headers,body) => formatRequest(url,method,headers,body),
        formatEnvRequest: (url,method,body) => formatEnvRequest(url,method,body)
    };
});

let rb = eval(globals.lib)();
rb.lib_check();
