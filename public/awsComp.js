async function CreateTableFromJSON() {
    try {

        let tables = document.getElementsByTagName("table");
        console.log(tables)
        for (item of tables) { 
            console.log(item); 
            item.remove();
        } 
      
    } catch (err) {

        console.log(err)
    }
    let entities = '';
    var settings = {
        "url": " /analyze",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({ "text": document.getElementById("w3review").value.trim() }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        var col = [];
        var col1 = [];
        let myBooks = response.entities;
        let keyPhrases = response.keyPhrases;
        //let pii = response.pii;
        // Modify array based on incident tickets
        myBooks.forEach(function(obj) {
            if (obj.Text.startsWith("INF") || obj.Text.startsWith("IND")) {
                obj.Type = 'INCIDENT';
                // Or: `obj.baz = [11, 22, 33];`
            }
            if (obj.Text.includes("Whirlpool")) {
                obj.Type = 'ORGANIZATION';
                // Or: `obj.baz = [11, 22, 33];`
            }
             console.log(typeof(obj.Text))
             var pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im ;
            if (pattern.test(obj.Text) && obj.Type == "OTHER") {
                obj.Type = 'PHONE NUMBER';
                // Or: `obj.baz = [11, 22, 33];`
            }
        });
        //alert(JSON.stringify(response.sentiment))
        document.getElementById("card").style.display = "block";
        let sentiment = response.sentiment.Sentiment;
        document.getElementById("mood").innerHTML = sentiment;
        if (sentiment === "NEUTRAL") {
            document.getElementById('moodImage').src = 'neutral.png'
        }
        else if (sentiment === "POSITIVE") {
            document.getElementById('moodImage').src = 'smile.png'

        }
        else if (sentiment === "NEGATIVE") {
            document.getElementById('moodImage').src = 'sad.png'

        } else {
            document.getElementById('moodImage').src = 'neutral.svg'

        }
        // document.getElementById("moodDetails").innerHTML = JSON.stringify(response.sentiment.SentimentScore);

        //document.createElement("div").innerHTML=response.sentiment;
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 3; i < 5; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            if (i == 3) {
                th.innerHTML = "Entity";
            } else if (i == 4) {
                th.innerHTML = "Type";
            }  // TABLE HEADER.
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 3; j < 5; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myBooks[i][col[j]];              
            }
        }

        //////////////////////////////////////////////////////////

        for (var i = 0; i < keyPhrases.length; i++) {
            for (var key in keyPhrases[i]) {
                if (col1.indexOf(key) === -1) {
                    col1.push(key);
                }
            }
        }
        // CREATE DYNAMIC TABLE.
        var table1 = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table1.insertRow(-1);                   // TABLE ROW.


        for (var i = 0; i < 2; i++) {
            var th = document.createElement("th");
            if (i == 0) {
                th.innerHTML = "Confidence";
            } else if (i == 1) {
                th.innerHTML = "Keyphrase";
            }  // TABLE HEADER.

            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < keyPhrases.length; i++) {

            tr = table1.insertRow(-1);

            for (var j = 2; j < 4; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = keyPhrases[i][col1[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");

        divContainer.appendChild(table);
        //divContainer.appendChild(table1);

    });


}

