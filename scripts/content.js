let lines = [];
let currFirstLine = '';
const lyricsDivSelector = '.NiCdLCpp3o2z6nBrayOn';

const apiKeyInput = document.createElement('input');
apiKeyInput.type = 'text';
apiKeyInput.placeholder = 'הזן מפתח גישה (מהאתר מתורגמיוזיק)';
apiKeyInput.style.borderRadius = '20px';
apiKeyInput.style.padding = '5px 10px';
apiKeyInput.style.border = '1px solid gray';
apiKeyInput.style.marginRight = '10px';
apiKeyInput.style.width = '220px';

const translateBtn = document.createElement('button');
translateBtn.innerText = 'תרגם לעברית';
translateBtn.style.borderRadius = '20px';
translateBtn.style.padding = '5px 10px';
translateBtn.style.border = '1px solid gray';
translateBtn.style.backgroundColor = 'gray';
translateBtn.style.color = 'white';
translateBtn.style.cursor = 'pointer';

let apiKey = null;
if (localStorage.getItem('MMusicKey') && localStorage.getItem('MMusicKey').length == 23) {
    translateBtn.innerText = 'תרגם לעברית';
    apiKey = localStorage.getItem('MMusicKey');
} else {
    translateBtn.innerText = 'שמור מפתח';
}

translateBtn.addEventListener('click', () => {
    if (apiKeyInput?.value && apiKeyInput?.value?.length == 23) {
        localStorage.setItem('MMusicKey', apiKeyInput.value);
        apiKey = apiKeyInput.value;
        translateBtn.innerText = 'תרגם לעברית';
        apiKeyInput.value = '';
        apiKeyInput.style.display = 'none';
    } else if (apiKey && apiKey.length == 23) {
        beforeGetFullTrans();
    } else {
        localStorage.removeItem('MMusicKey');
        alert('הזן מפתח גישה');
    }
});

const container = document.createElement('div');
container.style.zIndex = '99999999';
container.style.position = 'fixed';
container.style.top = '30px';
container.style.right = '25px';
container.style.display = 'flex';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';
// container.style.transform = 'translate(-50%, -50%)';

if (!apiKey) container.appendChild(apiKeyInput);
container.appendChild(translateBtn);

document.body.onload = () => {
    document.body.appendChild(container);
};

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

// waitForElm(lyricsDivSelector).then(() => { beforeGetFullTrans() }); // wait for lyrics to appear (didn't work without promise)

function beforeGetFullTrans() {
    lines = document.querySelectorAll(lyricsDivSelector);
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
                    <span class='innerTransLoader' direction=rtl> 
                        ...טוען תרגום 
                    </span>
                    <br>
                </span>
            `;
    }

    getFullTrans(linesText); // todo filter if not english, empty, and more
}

const serverUri = 'https://musicline-backend.vercel.app';

const getFullTrans = (src, index) => {
    fetch(`${serverUri}/trans/lines?key=${localStorage.getItem('MMusicKey')}`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-chrome-extension': 'meturgamusic'
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

            // empty the loaders if error
            alert('אירעה שגיאה בקבלת התרגום');
            let loaders = document.querySelectorAll(".transLoader")
            for (let loader of loaders) {
                loader.innerHTML = '';
            }
     
            // Check if response is 403 and change the button back to key input
            if (e.status === 403) {
                translateBtn.parentNode.replaceChild(apiKeyInput, translateBtn);
                localStorage.removeItem('MMusicKey');
            };
        });
}

function setLines(transArray) {
    let i = 0;
    for (elm of lines) {
        if (elm.getElementsByClassName("transLoader")[0]) {
            elm.getElementsByClassName("transLoader")[0].innerHTML = `
                <span class='innerTrans' direction=rtl> 
                    ${transArray[i]}
                <span>`;
            elm.style.marginBottom = '30px';
        }
        i++;
    }
    StartObserveSongChanges();
}

function StartObserveSongChanges() {
    translateBtn.style.display = 'none';
    // wait for new song changes:
    const titleChangeObserver = new MutationObserver(mutationsList => {
        if (!document.querySelectorAll('.innerTrans')[0]) translateBtn.style.display = 'block';
        // titleChangeObserver.disconnect();
    });

    titleChangeObserver.observe(document.querySelectorAll(".Q2RPoHcoxygOoPLXLMww")[0], {
        childList: true,
        subtree: true,
        characterData: true,
    });
}