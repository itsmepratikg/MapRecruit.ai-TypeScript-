function onGmailMessageOpen(e) {
    var accessToken = e.messageMetadata.accessToken;
    var messageId = e.messageMetadata.messageId;
    var threadId = e.messageMetadata.threadId;

    // MapRecruit API Endpoint
    var url = "https://YOUR_DOMAIN/api/v1/integrations/gmail/webhook";

    var payload = {
        "messageId": messageId,
        "threadId": threadId,
        "userEmail": Session.getActiveUser().getEmail()
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "headers": {
            "Authorization": "Bearer " + ScriptApp.getOAuthToken()
        }
    };

    UrlFetchApp.fetch(url, options);

    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("MapRecruit Integration"))
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph().setText("Email processed successfully.")))
        .build();
}

function buildAddOn(e) {
    var accessToken = e.messageMetadata.accessToken;
    var messageId = e.messageMetadata.messageId;

    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("MapRecruit"))
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph().setText("Click to sync email with MapRecruit."))
            .addWidget(CardService.newTextButton().setText("Sync Email").setOnClickAction(CardService.newAction().setFunctionName("onGmailMessageOpen")))
        )
        .build();
}
