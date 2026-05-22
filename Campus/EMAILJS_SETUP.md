# EmailJS Setup Instructions

## Overview
Your contact form is now integrated with EmailJS! Follow these steps to complete the setup.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add an Email Service

1. Go to the **Email Services** section in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Note down your **Service ID** (e.g., `service_abc1234`)

## Step 3: Create an Email Template

1. Go to the **Email Templates** section
2. Click **Create New Template**
3. Use the following template structure:

### Template Content:

**Subject:**
```
Nouveau message de contact - {{subject}}
```

**Body:**
```html
<h2>Nouveau message depuis le site IFESSP</h2>

<p><strong>Nom:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>
<p><strong>Sujet:</strong> {{subject}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><em>Ce message a été envoyé depuis le formulaire de contact du site IFESSP.</em></p>
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz5678`)

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abcdef123456`)

## Step 5: Update Your Website Configuration

Open `script.js` and replace the placeholder values on lines 159-161:

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';      // Replace with your Public Key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';      // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';    // Replace with your Template ID
```

### Example:
```javascript
const EMAILJS_PUBLIC_KEY = 'abcdef123456';
const EMAILJS_SERVICE_ID = 'service_abc1234';
const EMAILJS_TEMPLATE_ID = 'template_xyz5678';
```

## Step 6: Test Your Contact Form

1. Open your website in a browser
2. Fill out the contact form with test information
3. Submit the form
4. Check your email inbox for the test message
5. If successful, you should see a success notification on the website

## Troubleshooting

### Issue: "Service d'email non disponible"
- **Solution:** Make sure the EmailJS SDK is loaded properly. Check your browser console for errors.

### Issue: Email not received
- **Solutions:**
  - Verify your Service ID, Template ID, and Public Key are correct
  - Check your spam/junk folder
  - Ensure your email service is properly connected in EmailJS dashboard
  - Check the EmailJS dashboard for any error logs

### Issue: Template variables not showing
- **Solution:** Make sure your HTML form field `name` attributes match the template variables:
  - `name` → {{name}}
  - `email` → {{email}}
  - `phone` → {{phone}}
  - `subject` → {{subject}}
  - `message` → {{message}}

## Form Field Mapping

Your form fields are already properly configured:
- `id="name" name="name"` → {{name}}
- `id="email" name="email"` → {{email}}
- `id="phone" name="phone"` → {{phone}}
- `id="subject" name="subject"` → {{subject}}
- `id="message" name="message"` → {{message}}

## Free Tier Limitations

EmailJS free tier includes:
- **200 emails per month**
- **2 email services**
- **Unlimited email templates**

If you need more, consider upgrading to a paid plan.

## Features Included

✅ Real-time email sending
✅ Loading state with spinner
✅ Success/error notifications
✅ Form validation
✅ Form reset after successful submission
✅ Button disabled during submission to prevent duplicate sends

## Support

For EmailJS documentation and support:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/docs/support/)

---

**Need help?** Contact Marouan Khaba on [WhatsApp](https://wa.me/212644682293)
