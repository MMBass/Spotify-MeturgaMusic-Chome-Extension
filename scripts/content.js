
let lines = [];

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.NiCdLCpp3o2z6nBrayOn').then((elm) => {
    lines = document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn");
    const linesText = [];

    for (elm of lines) {
        linesText.push({ src: elm.innerText });

        if (elm.innerText.length > 3) elm.innerHTML +=
            `<br>
                 <span class='transLoader'> 
                    <span class='InnerTransLoader'> 
                      ...טוען תרגום 
                    </span>
                 </span>
            </br>
            </br>`;

    }
    getFullTrans(linesText); // todo filter if not english, empty, and more
});

// todo observe if first line of NiCdLCpp3o2z6nBrayOn text changes / to another song (always same URL)

const serverUri = ''; // the translation should be private

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
        if (elm.getElementsByClassName("transLoader")[0]) {
            elm.getElementsByClassName("transLoader")[0].innerHTML = `
                <span class='InnerTransLoader'> 
                     ${transArray[i]}
                <span>`;
        }
        i++;
    }
}