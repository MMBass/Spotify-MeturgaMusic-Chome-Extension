
let lines = [];

// todo observe if first line of NiCdLCpp3o2z6nBrayOn text changes / to another song (always same URL)
let myInterval = setInterval(() => {
    console.log("inter");
    if (document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn")[0]) {
        clearInterval(myInterval)
        lines = document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn");
        const linesText = [];

        for (elm of lines) {
            linesText.push({src:elm.innerText});

            // put the loader in span
            // if (elm.innerText.length > 3) elm.innerHTML += "<br> ...טוען תרגום <br><br>";
           
        }
        getFullTrans(linesText); // todo filter if not english, empty, and more
    }
}, 30);

const serverUri = ''; // the translation server is private

const getFullTrans = (src, index) => {
    fetch(`${serverUri}/trans/lines`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "lines": src,
            song_id: "song_id",
            title: "spotify test title"
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data?.trans.length) {
                setLines(data.trans);
            }
        }
        ).catch((e) => {
            // todo - alert "translation error" and remove the 'טוען תרגום..' spans
            console.log(e);
        });
}

function setLines(transArray) {
    let i = 0;
    for (elm of lines) {
        if (elm.innerText.length > 3){
            // todo replace the span instead of whole string
            // elm.innerText = elm.innerText.replaceAll('טוען תרגום...','')
            elm.innerHTML += "<br> "+transArray[i]+"<br><br>";
        } 
        i++;
    }
}

// **observer doesnt work at page load**

// const observerOptions = {
//     childList: true,
//     attributes: true,

//     // Omit (or set to false) to observe only changes to the parent node
//     subtree: false
// }

// function callback() {
//     if (document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn")[0]) {
//         const lines = document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn");

//         for(elm of lines){
//             if(elm.innerText.length > 3)elm.innerHTML += "<br> ...טוען תרגום <br><br>";

//         }
//         observer.disconnect();
//     }
// }

// const observer = new MutationObserver(callback);
// observer.observe(document.body, observerOptions);