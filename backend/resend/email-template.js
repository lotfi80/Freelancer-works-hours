export const verificationTokenEmailTemplate = (verificationToken) => `
<!DOCTYPE html>
<html dir="ltr" lang="de">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="background-color:#fff;color:#212121;font-family:sans-serif;">
  <table align="center" width="100%" style="max-width:600px;padding:20px;margin:0 auto;background-color:#f9f9f9;">
    <tr>
      <td style="text-align:center;">
        <h2>Willkommen bei Acme!</h2>
        <p style="font-size:16px;">
          Bitte klicken Sie auf den Button unten, um Ihre E-Mail-Adresse zu bestätigen:
        </p>
        <a 
          href="https://deine-app.de/verify?token=${verificationToken}" 
          style="display:inline-block;padding:10px 20px;background-color:#007BFF;color:#fff;text-decoration:none;border-radius:5px;margin-top:20px;"
        >
         ${verificationToken}
        </a>
        <p style="font-size:14px;color:#555;margin-top:20px;">
          Falls der Button nicht funktioniert, kopieren Sie bitte diesen Link in Ihren Browser:<br/>
          <a href="https://deine-app.de/verify?token=${verificationToken}">https://deine-app.de/verify?token=${verificationToken}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
export const WELCOME_EMAIL_TEMPLATE = (name) => `
  <html>
    <body style="background-color:#fff;color:#212121;font-family:sans-serif;">
    <table align="center" width="100%" style="max-width:600px;padding:20px;margin:0 auto;background-color:#f9f9f9;">
    <tr>
      <td style="text-align:center;">
        <h2>Hi ${name} !</h2>
        
        
        <p>Welcome You are now verified!</p>
      </td>
    </tr>
  </table>
    
    </body>
  </html>
`;
