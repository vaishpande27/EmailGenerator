console.log("Email writer extension - content script loaded")

//Searches for Gmail’s compose/reply toolbar where buttons like Send, Attach, etc. appear.
function findComposeToolbar() { 
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

//Creates a custom Gmail-styled button labeled “AI Reply”.
function createAIButton() {
    const btn = document.createElement('div');
    btn.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    btn.style.marginRight = '8px';
    btn.innerHTML = 'AI Reply';
    btn.setAttribute('role', 'button');
    btn.setAttribute('data-tooltip', 'generate AI Reply');
    return btn;
}

//Extracts the email body text from the currently opened email.
function getEmailContent() {
    const selectors = [
        '.a3s.aiL',
        '.h7',
        '.gmail_quote',
        '[role = "presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return null;
}

function injectButton() {
    const exisitingBtn = document.querySelector('.ai-reply-button');
    if (exisitingBtn) exisitingBtn.remove();

    const toolbar = findComposeToolbar();

    if (!toolbar) {
        console.log("toolbar not fount!");
        return;
    }
    console.log("toolbar found, creating AI button.");
    const btn = createAIButton();
    btn.classList.add('ai-reply-button');

    btn.addEventListener('click', async () => {
        try {
            btn.innerHTML = "Generating...";
            btn.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    emailContent : emailContent,
                    tone : "professional"
                })
            });

            if(!response.ok){
                throw new Error ('API Request Failed.');
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);    //Inserts AI-generated text into Gmail’s compose box.
            }else{
                console.error("Composebox was not found");
            }

        } catch (err) {
            console.error(err);
            alert("failed to genrate reply");
        }finally{
            btn.innerHTML = 'AI Reply';
            btn.disabled = false ; 
        }
    });

    toolbar.insertBefore(btn, toolbar.firstChild);
}
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("compose window detected");
            setTimeout(injectButton, 500);
        }

    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})