
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const transporter = nodemailer.createTransport(process.env.SMTP_URL);

transporter.use('compile', hbs({
  viewEngine: {
    layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
    partialsDir: path.join(__dirname, '..', 'views', 'partials'),
    defaultLayout: 'layout'
  },
  viewPath: path.join(__dirname, '..', 'views'),
}));

module.exports = transporter;
