import sgMail from '@sendgrid/mail'
import request from 'request'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendWelcomeEmail = async (email: string, name: string): Promise<[request.Response, {}]> => {
  return sgMail.send({
    to: email,
    from: 'whatemail@gmail.com',
    subject: 'Thanks for joining us!',
    text: 'Welcome to the app, ' + name
  }, false)
}

export const sendGoodbyeEmail = async (email: string, name: string): Promise<[request.Response, {}]> => {
  return sgMail.send({
    to: email,
    from: 'whatemail@gmail.com',
    subject: 'Sorry to see you go',
    text: `Hope to see you back soon, ${name}!`
  }, false)
}
