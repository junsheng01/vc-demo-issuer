import { SES } from 'aws-sdk';
import emailjs from 'emailjs-com';
import config from '../config';

// Sender email
const sender_email = 'no-reply@vc-generator.com';

export const sendAWSEmail = (
  qrCode: string,
  sharingUrl: string,
  receiver_email: string
) => {
  const ses = new SES({
    apiVersion: '2020-12-01',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: 'us-east-1',
  });

  const redirectUrl: string = `${config.wallet_url}/accept-credentials?vcURL=${sharingUrl}`;

  let ses_mail =
    "From: 'StartUpA Driving License Issuer' <" + sender_email + '>\n';
  ses_mail = ses_mail + 'To: ' + receiver_email + '\n';
  ses_mail = ses_mail + 'Subject: Driving License VC Approval\n';
  ses_mail = ses_mail + 'MIME-Version: 1.0\n';
  ses_mail =
    ses_mail + 'Content-Type: multipart/mixed; boundary="NextPart"\n\n';
  ses_mail = ses_mail + '--NextPart\n';
  ses_mail = ses_mail + 'Content-Type: text/html; charset=iso-8859-1\n\n';
  ses_mail = ses_mail + '<html>\n\n';
  ses_mail = ses_mail + '<body>\n\n';
  ses_mail =
    ses_mail +
    '<h2>Your application for verifiable credentials has been approved.</h2>\n\n';
  ses_mail =
    ses_mail +
    '<p>You can retrieve and store your verifiable credentials through the link provided.</p>\n\n';
  ses_mail =
    ses_mail + "<p>Link: <a href='" + redirectUrl + "'>Sharing URL</a></p>\n\n";
  ses_mail = ses_mail + '</body>\n\n';
  ses_mail = ses_mail + '</html>\n\n';

  const params = {
    RawMessage: { Data: ses_mail },
    Destinations: [receiver_email],
    Source: 'StartUpA Driving License Issuer <' + sender_email + '>',
  };

  ses.sendRawEmail(params, (err: any, data: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log('send');
      console.log(data);
    }
  });
};

export const sendEmail = (
  qrCode: string,
  sharingUrl: string,
  receiver_email: string
) => {
  if (
    config.emailJsServiceID &&
    config.emailJsTemplateID &&
    config.emailJsUserID
  ) {
    emailjs
      .send(
        config.emailJsServiceID,
        config.emailJsTemplateID,
        {
          receiver_email: receiver_email,
          link: `${config.wallet_url}/accept-credentials?vcURL=${sharingUrl}`,
        },
        config.emailJsUserID
      )
      .then(
        function (response) {
          console.log('SUCCESS!', response.status, response.text);
        },
        function (error) {
          console.log('FAILED...', error);
        }
      );
  }
};
