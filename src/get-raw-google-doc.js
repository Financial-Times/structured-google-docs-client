/* eslint-disable no-console */
import dotenv from 'dotenv';
import google from 'googleapis';
import promisify from 'es6-promisify';

export default async function getRawGoogleDoc(googleDocId) {
  dotenv.load({ silent: true });
  const drive = google.drive('v3');

  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii'),
    ['https://www.googleapis.com/auth/drive'],
    process.env.CLIENT_EMAIL_IMPERSONATE,
  );

  jwtClient.authorize((jwtClientErr) => {
    if (jwtClientErr) {
      console.log('jwtClientErr', jwtClientErr);
    }
  });

  const rawGoogleDoc = await promisify(drive.files.export)({
    fileId: googleDocId, // A Google Doc
    auth: jwtClient,
    mimeType: 'text/html',
  }).then((resp, err) => {
    if (err) {
      console.log('Error during download', err);
      return true;
    }
    return resp;
  });

  return rawGoogleDoc;
}
