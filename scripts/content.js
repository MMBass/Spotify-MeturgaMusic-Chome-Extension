
let lines = [];
let currFirstLine = '';

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.NiCdLCpp3o2z6nBrayOn').then(() => { beforeGetFullTrans() }); // wait for lyrics to appear (didn't work without a promise)

function beforeGetFullTrans() {

    lines = document.getElementsByClassName("NiCdLCpp3o2z6nBrayOn");
    // const enNumsCharsRegex = /^[a-zA-Z0-9!@#$%^&*()-_=+[\]{}|;:'",.<>/? ]*$/;

    // for (elm of lines) {
    //     if (enNumsCharsRegex.test(elm.textContent)) return;
    // }

    const linesText = [];

    for (elm of lines) {
        linesText.push({ src: elm.innerText });

        if (elm.innerText.length > 3) elm.innerHTML +=
            `
                <span class='transLoader'> 
                    <span class='InnerTransLoader' direction=rtl> 
                        ...טוען תרגום 
                    </span>
                </span>
                <br>
            `;
    }

    getFullTrans(linesText); // todo filter if not english, empty, and more
}

const serverUri = 'https://musicline-backend.vercel.app';

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
            if (data?.trans?.length) {
                currFirstLine = lines[0].textContent;
                setLines(data.trans);
            }
        }
        ).catch((e) => {
            console.log(e);
            let i = 0;
            for (elm of lines) {
                if (elm.getElementsByClassName("transLoader")[0]) {
                    if (i === 0) { elm.getElementsByClassName("transLoader")[0].innerHTML = `*ארעה שגיאה בתרגום*`; }
                    elm.getElementsByClassName("transLoader")[0].parentElement.remove();
                }
                i++;
            } // empty the loader if error
        });
}

function setLines(transArray) {
    let i = 0;
    for (elm of lines) {
        if (elm.getElementsByClassName("transLoader")[0]) {
            elm.getElementsByClassName("transLoader")[0].innerHTML = `
                <span class='InnerTrans' direction=rtl> 
                     ${transArray[i]}
                <span>`;
        }
        i++;
    }
    StartObserveSongChanges();
}

function StartObserveSongChanges() {
    // wait for new song changes:
    const titleChangeObserver = new MutationObserver(mutationsList => {
        if (mutationsList[0].textContent != currFirstLine) beforeGetFullTrans();
        titleChangeObserver.disconnect();
    });

    titleChangeObserver.observe(document.querySelectorAll(".Q2RPoHcoxygOoPLXLMww")[0], {
        childList: true,
        subtree: true,
        characterData: true,
    });
}