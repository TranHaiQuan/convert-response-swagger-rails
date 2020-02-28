$(function() {
  $("#submit").on("click", function() {
    var datas = JSON.parse($("#sample").val());
    var a = "";
    var fd = new FormData();
    fd.append( 'code', handleDatas(datas).substring(1, result.length) + "\n");
    $.ajax({
      url: "https://tools.tutorialspoint.com/format_ruby.php",
      method: "POST",
      dataType: "json",
      data: fd,
      processData: false,
      contentType: false,
      success: function(response) {
        $("#result").val(response.code);
        $("#result").select();
    document.execCommand("copy");
      },
      error: function(){
        location.reload();
      }
    });

  })

  function handleDatas(datas) {
    var result = "";
    $.each(datas, function(key, val) {
      if (typeof val == "string" || typeof val == "number" || typeof val == "boolean") {
        // string, number, boolean
        result += handleStringDatas(key, val);
      } else if (Array.isArray(val)) {
        // Array
        result += handleArrayDatas(key, val);
      } else if (typeof val == "object") {
        // Json
        result += handleJsonDatas(key, val);
      }
    })

    return result;
  }

  function handleJsonDatas(parentKey, datas) {
    var result = "\nproperty :"+ parentKey +" do\n  key :type, :object";
    $.each(datas, function(key, val) {
      if (typeof val == "string" || typeof val == "number" || typeof val == "boolean") {
        // string, number, boolean
        result +=handleStringDatas(key, val);
      } else if (Array.isArray(val)) {
        // Array
        result += handleArrayDatas(key, val);
      } else if (typeof val == "object") {
        // Json
        result += handleJsonDatas(key, val);
      }
    })
    return result + "\nend";
  }

  function handleStringDatas(key, val) {
    var attrType = convertType(val);
    if (typeof val == "string") val = "\"" + val + "\"";
    return "\nproperty :" + key + " do\n  key :type, :" + attrType + "\n  key :example, " + val + "\nend"
  }

  function handleArrayDatas(parentKey, val) {
    if (typeof val[0] == "string" || typeof val[0] == "number" || typeof val[0] == "boolean" || Array.isArray(val[0])) {
      return handleArrayNormal(parentKey, val);
    } else {
      return handleArrayJson(parentKey, val)
    }
  }

  function handleArrayNormal(key, val) {
    if (typeof val[0] == "string") {
      val = "\"" + val.join("\", \"") + "\"";
    }
    return "\nproperty :" + key + " do\n  key :type, :array\n  key :example, [" + val + "]\nend"
  }

  function handleArrayJson(parentKey, val) {
    var result = "\nproperty :"+ parentKey +" do\n  key :type, :array\n  items do";
    $.each(val, function(index, elm) {
      if (typeof val == "string" || typeof elm == "number" || typeof elm == "boolean") {
        // string, number, boolean
        result += handleStringDatas(key, val);
      } else if (Array.isArray(elm)) {
        // Array
        handleArrayDatas(key, val);
      } else if (typeof elm == "object") {
        // Json
        result += handleDatas(elm);
      }
    })
    return result + "\nend\nend"
  }

  function convertType(val) {
    var oldType = Array.isArray(val) ? "array" : typeof val;
    var newType = "";
    switch(oldType) {
      case "number":
        newType = "integer";
        break;
      default:
        newType = oldType;
    }
    return newType;
  }
})
