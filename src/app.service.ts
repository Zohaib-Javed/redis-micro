import { Injectable } from '@nestjs/common';
import * as GoogleApis from 'googleapis';
import * as NodeMailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import handleBars from 'handlebars';
@Injectable()
export class AppService {
  async sendEmail(email) {
    console.log(`Sending Email to ${email}....`);

    const clientId=process.env.clientId; // to be added
    const clientSecret=process.env.clientSecret; //to be added
    const refreshToken=process.env.refreshToken; //to be added

    const redirectUri="https://developers.google.com/oauthplayground";
    const OAuth2Client=new GoogleApis.Auth.OAuth2Client(clientId,clientSecret,redirectUri);
    OAuth2Client.setCredentials({refresh_token:refreshToken})
    try {
      const accessToken=await OAuth2Client.getAccessToken();
      let transporter = NodeMailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
          type:'OAuth2',
          user:process.env.user,
          refreshToken,
          clientId,
          clientSecret,
          accessToken
        },
        tls:{rejectUnauthorized:false}
      });
      var source = fs.readFileSync(path.resolve(__dirname,'./templatesHtml/opt.hbs'), "utf8");
      const template=handleBars.compile(source)

      const optData={
        code:"506436"
      }

      let info = await transporter.sendMail({
        from: process.env.user, // sender address
        to: "zohaib.javed@phaedrasolutions.com", // list of receivers
        subject: "Testing Nodemailer", // Subject line
        text: "Testing nodemailer using gmail.", // plain text body
        html:template(optData)
      },(err,data)=>{
        if(err)
          console.log(err);
        else 
          console.log("Email sent!!", data)
      });

    } catch (error) {
      console.log(error);
    }
  }
}
