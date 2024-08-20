const MsgReader = require('@kenjiuno/msgreader')['default'];
const fs = require('fs');
const path = require('path');

// Read the .msg file into a buffer
const msgFileBuffer = fs.readFileSync('./Byzfunder.msg');

// Create an instance of MsgReader with the file buffer
const testMsg = new MsgReader(msgFileBuffer);

// Retrieve file data from the .msg file
const testMsgInfo = testMsg.getFileData();

// Extract email details based on the structure
const from = testMsgInfo.from || 'Not Available';
const to = testMsgInfo.to || 'Not Available';
const date = testMsgInfo.date || 'Not Available';
const subject = testMsgInfo.subject || 'Not Available';
const body = testMsgInfo.body || 'No Body Content';

// Log the email details
console.log('From:', from);
console.log('To:', to);
console.log('Date:', date);
console.log('Subject:', subject);
console.log('Body:', body);

// Define the folder where attachments will be saved
const attachmentFolder = path.join(__dirname, 'attachments');

// Create the folder if it doesn't exist
if (!fs.existsSync(attachmentFolder)) {
    fs.mkdirSync(attachmentFolder);
}

// Check if there are attachments and process them
if (testMsgInfo.attachments && testMsgInfo.attachments.length > 0) {
    console.log('Attachments:');
    for (const att of testMsgInfo.attachments) {
        console.log(' - Filename: ' + att.fileName);

        // Check if the attachment is an image (optional, based on file extension)
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
        const fileExtension = att.fileName.substring(att.fileName.lastIndexOf('.')).toLowerCase();

        if (imageExtensions.includes(fileExtension)) {
            // Get attachment content
            const attachmentContent = testMsg.getAttachment(att).content;

            // Define the file path for the attachment
            const filePath = path.join(attachmentFolder, att.fileName);

            // Save the image to the specified folder
            fs.writeFileSync(filePath, attachmentContent);
            console.log(`Saved ${att.fileName} to ${filePath}`);
        }
    }
} else {
    console.log('No attachments found.');
}
