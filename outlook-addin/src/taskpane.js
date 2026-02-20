Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        document.getElementById("run").onclick = run;
    }
});

async function run() {
    const message = document.getElementById("message");
    const error = document.getElementById("error");
    message.innerText = "";
    error.innerText = "";

    const item = Office.context.mailbox.item;

    if (item.attachments.length === 0) {
        error.innerText = "No attachments found.";
        return;
    }

    // Get the first attachment
    const attachment = item.attachments[0];

    // Outlook API to get content
    item.getAttachmentContentAsync(attachment.id, async (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            const content = result.value.content;
            const format = result.value.format; // "base64" usually

            try {
                // Post to Backend
                // NOTE: Replace localhost with your actual backend URL if deployed
                const response = await fetch("http://localhost:5000/api/v1/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileName: attachment.name,
                        fileData: content,
                        encoding: format
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    message.innerText = `Success! Uploaded: ${data.fileName}`;
                } else {
                    error.innerText = `Upload failed: ${data.error}`;
                }
            } catch (err) {
                error.innerText = `Network error: ${err.message}`;
            }

        } else {
            error.innerText = "Failed to get attachment content.";
        }
    });
}
