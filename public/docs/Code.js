function buildAddOn(e) {
    var card = CardService.newCardBuilder();
    var section = CardService.newCardSection();

    var pushButton = CardService.newTextButton()
        .setText("Push Attachment to Server")
        .setOnClickAction(CardService.newAction().setFunctionName("pushToServer"));

    section.addWidget(CardService.newButtonSet().addButton(pushButton));
    card.addSection(section);

    return card.build();
}

function pushToServer(e) {
    var messageId = e.gmail.messageId;
    GmailApp.setCurrentMessageAccessToken(e.gmail.accessToken);
    var message = GmailApp.getMessageById(messageId);
    var attachments = message.getAttachments();

    if (attachments.length === 0) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification().setText("No attachments found."))
            .build();
    }

    var fileBlob = attachments[0];

    // NOTE: Replace with your actual public backend URL (ngrok or deployed)
    // Google Apps Script cannot hit 'localhost'
    var url = "https://your-backend-url.com/api/v1/upload";

    var options = {
        "method": "POST",
        "payload": {
            "file": fileBlob,
            "fileName": fileBlob.getName()
        },
        "muteHttpExceptions": true
    };

    try {
        var response = UrlFetchApp.fetch(url, options);
        var code = response.getResponseCode();
        var text = response.getContentText();

        if (code === 200 || code === 201) {
            return CardService.newActionResponseBuilder()
                .setNotification(CardService.newNotification().setText("Success! File pushed."))
                .build();
        } else {
            return CardService.newActionResponseBuilder()
                .setNotification(CardService.newNotification().setText("Error: " + code))
                .build();
        }
    } catch (err) {
        return CardService.newActionResponseBuilder()
            .setNotification(CardService.newNotification().setText("Network Error: " + err.message))
            .build();
    }
}
