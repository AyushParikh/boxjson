function newtable(){
    var dbname = document.getElementById("dbname").value;
    var password = document.getElementById("password").value;
    var confpassword = document.getElementById("confpassword").value;

    if (password !== confpassword){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match'
        })
    } else if (password.length <= 5) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password must be 6 characters or longer.'
        })
    } else {

        $.ajax({
            method: "POST",
            url: "/api/checkdbname/",
            data: {
                dbname: dbname
            },
            success: function(data){
                console.log(data)
                var divinfo = document.getElementById("infodiv");
                divinfo.style.display = "none";
        
                var divmodel = document.getElementById("divmodel");
                divmodel.style.display = "block";
            },
            error: function (err){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'That database name is taken.'
                })
            }
        });
    }
}



function checkSchema(schema){
    for (let key in schema){
        var child = schema[key];
        if (typeof(child) !== "object"){
            if (child.toUpperCase() === "STRING" || child.toUpperCase() === "NUMBER" || child.toUpperCase() === "BOOLEAN"){

            } else {
                return false
            }
        } else {
            if (checkSchema(child) == false){
                return false
            }
        }
    }
    return true
}

function deploySchema(dbname, password, schema){
    $.ajax({
        method: "POST",
        url: "/api/createdatabase/",
        data: {
            dbname: dbname,
            password: password, 
            schema: schema
        },
        success: function(data){
            window.location.href = "db/"+dbname;
        },
        error: function (err){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseText
            })
        }
    });
}


function verifyJSON(){
    var schema = document.getElementById("schemaArea").value;
    try {
        JSON.parse(schema);
        if (checkSchema(JSON.parse(schema))){
            document.getElementById("schemaArea").value = JSON.stringify(JSON.parse(schema), null, "\t");
            deploySchema(document.getElementById("dbname").value, document.getElementById("password").value, JSON.parse(schema));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid schema structure.',
                footer : "<b>Make sure you have double quoted each key and variable and are using the supported data types. String, Number, Boolean</b>"
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid schema structure.',
            footer : "<b>Make sure you have double quoted each key and variable and are using the supported data types. String, Number, Boolean</b>"
        })
    }
}

function deploy(){
    verifyJSON()
}

