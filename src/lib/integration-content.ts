export type CodeBlock = { label?: string; code: string };
export type GuideSection = { id: string; heading: string; paragraphs?: string[]; steps?: string[]; blocks?: CodeBlock[] };
export type GuideTab = { id: string; label: string; sections: GuideSection[] };

export const guideTabs: GuideTab[] = [
  {
    id: "web",
    label: "Web",
    sections: [
      {
        id: "overview",
        heading: "1. Overview",
        paragraphs: [
          "This document provides Noqoody specification including integration with merchant website, and specification of initializing payment process. This document also provides HTTP API used to get payment token, validating payment request, as well as payment response with HTTP API specification.",
        ],
      },
      {
        id: "security",
        heading: "2. Authentication and Security",
        paragraphs: [
          "Noqoody payment gateway exchanges data between merchant and gateway in the form of Request and Response. All communications with Noqoody are encrypted with an external layer of encryption \u201cSSL\u201d. Once you are enrolled in Noqoody, you will be provided with a unique UserID for both a sandbox and a production environment. The production UserID will be provided upon successful completion of your sandbox integration. Please note that the UserID is not interchangeable. It is the merchant\u2019s responsibility to keep the credentials in a secure and hidden environment.",
        ],
      },
      {
        id: "authorization",
        heading: "3. Merchant Authorization",
        paragraphs: ["Noqoody requires user identification for each transaction level authentication and authorization."],
      },
      {
        id: "token",
        heading: "4.1 Token",
        paragraphs: ["To start using Noqoody Payment Services, first call the following API to receive the bearer token."],
        blocks: [
          { label: "API", code: "https://noqoodypay.com/sdk/token" },
          {
            label: "Request",
            code: `POST /sdk/token HTTP/1.1
Host: noqoodypay.com
Content-Length: 72
grant_type=password&username=noqoody_user_name&password=noqoody_password`,
          },
          {
            label: "Response",
            code: `{
    "access_token": "access_token",
    "token_type": "bearer",
    "expires_in": 1209599,
    "userName": "user_name",
    "Name": "name_on_noqoody_account",
    "Role": "user_role",
    "ImageLocation": "logo_on_noqoody_account",
    "Email": "name_on_noqoody_account",
    ".issued": "Sun, 07 Aug 2022 07:38:57 GMT",
    ".expires": "Sun, 21 Aug 2022 07:38:57 GMT"
}`,
          },
        ],
      },
      {
        id: "generate-link",
        heading: "4.2 Generate Link & Session",
        paragraphs: [
          "This API will generate the payment URL which will redirect the user to Noqoody where the payment will be handled automatically by the Noqoody Payment System, or the SessionID and UUID can be used in section 4.3 for generating the links separately if you are looking for a custom solution.",
          "4.2.1 Generate Secure Hash (SHA256) \u2014 Format: {CustomerEmail}{CustomerName}{CustomerMobile}{Description}{ProjectCode}{Reference}. You will need the Client Secret Key as the key value to generate the secure hash. The client secret is sent via email to the registered account; for sandbox, the secret key is available in the portal provided by the Technical Support Team.",
        ],
        blocks: [
          {
            label: "Request",
            code: `POST /sdk/api/PaymentLink/GenerateLinks HTTP/1.1
Host: noqoodypay.com

{
    "ProjectCode": "your_project_code",
    "Description": "order_description_less_than_40_characters",
    "Amount": "45.00",
    "CustomerEmail": "customers_email",
    "CustomerMobile": "customers_mobile_number",
    "CustomerName": "customers_name",
    "SecureHash": "secure_hash",
    "Reference": "reference_id"
}`,
          },
          {
            label: "Response",
            code: `{
    "PaymentUrl": "https://sandbox.noqoodypay.com/test/payment.html?SessionID=...&uuid=136852454",
    "ProjectCode": "project_code",
    "Reference": "your_custom_unique_reference",
    "Description": "Order_Description",
    "Amount": 36,
    "SessionId": "8116ba10-1a25-457e-a818-vcaa323kjdfs",
    "Uuid": "136852454",
    "success": true,
    "code": "OK",
    "message": "Payment Link Generated",
    "errors": []
}`,
          },
        ],
      },
      {
        id: "payment-options",
        heading: "4.3 Generate Payment Options",
        paragraphs: [
          "The response contains payment links for Credit Card, Debit Card, PayPal, Google Pay\u2122, Ooredoo and Vodafone.",
        ],
        blocks: [
          {
            label: "Request",
            code: `GET /sdk/api/PaymentLink/PaymentChannels?SessionID=sessionid_here&uuid=uuid_here HTTP/1.1
Host: noqoodypay.com`,
          },
          {
            label: "Response",
            code: `{
    "PaymentChannels": [
        {
            "ID": 0,
            "ChannelName": "Payment_Channel_Name",
            "ImageLocation": "Payment_Channel_Image",
            "PaymentURL": "Payment_URL_Used_for_redirecting_customer"
        }
    ],
    "TransactionDetail": {
        "MerchantName": "Company_name_on_noqoody_account",
        "Amount": 36,
        "Reference": "your_custom_unique_reference",
        "CustomerEmail": "example@gmail.com",
        "CustomerMobile": "12345678",
        "MerchantLogo": "your_company_logo_url"
    },
    "success": true,
    "code": "200",
    "errors": []
}`,
          },
        ],
      },
      {
        id: "validate",
        heading: "4.4 Validate Payment",
        blocks: [
          {
            label: "Request",
            code: `GET /sdk/api/Members/GetTransactionDetailStatusByClientReference/?ReferenceNo={your_unique_reference} HTTP/1.1
Host: www.noqoodypay.com`,
          },
          {
            label: "Response (Successful)",
            code: `{
    "TransactionID": "00000",
    "Amount": 1.0000,
    "TransactionDate": "2022-05-17T09:02:30.097",
    "TransactionStatus": "0000",
    "Reference": "your_custom_unique_reference",
    "ServiceName": "Payment_Channel_Name",
    "TransactionMessage": "Payment processed successfully.",
    "PUN": "noqoody_bank_reference",
    "InvoiceNo": "invoice_number",
    "success": true,
    "code": "OK",
    "message": "Transaction Found",
    "errors": []
}`,
          },
          {
            label: "Response (Failure)",
            code: `{
    "TransactionID": "00000",
    "Amount": 36.0000,
    "TransactionStatus": "2996",
    "TransactionMessage": "Canceled before payment method selection.",
    "success": false,
    "code": "OK",
    "message": "Transaction Found",
    "errors": []
}`,
          },
        ],
      },
    ],
  },
  {
    id: "telecom",
    label: "Telecom",
    sections: [
      {
        id: "telecom-intro",
        heading: "Before you start",
        paragraphs: [
          "Before we can start using mobile payments, please follow the steps in the Web tab until section 4.2.2 to generate the SessionID and UUID. Then follow the steps below.",
        ],
      },
      {
        id: "otp-send",
        heading: "1. Sending OTP to mobile number",
        paragraphs: [
          "The following API consumes the SessionID, UUID and an extra field ChannelID, which represents the type of mobile payment. Ooredoo = 1, Vodafone = 2.",
        ],
        blocks: [
          {
            label: "API",
            code: `https://noqoodypay.com/sdk/api/PaymentLink/RequestDCBPayment

Request
{
    "SessionID": "sample string 1",
    "UUID": "sample string 2",
    "ChannelID": 3
}

Response
{
    "SessionID": "sample string 1",
    "UUID": "sample string 2",
    "ChannelID": 2,
    "RequestNumber": "sample string 4",
    "success": true,
    "code": "sample string 6",
    "message": "sample string 7",
    "errors": []
}`,
          },
        ],
      },
      {
        id: "otp-validate",
        heading: "2. Validating OTP",
        paragraphs: [
          "This API consumes the SessionID, UUID, RequestNumber (from the previous response) and the OTP. Use the RedirectURL in the response to send the user back to the callback URL set in your Noqoody account.",
        ],
        blocks: [
          {
            label: "API",
            code: `https://noqoodypay.com/sdk/api/PaymentLink/ProcessDCBPayment

Request
{
    "SessionID": "sample string 1",
    "UUID": "sample string 2",
    "RequestNumber": "sample string 3",
    "OTP": "sample string 4"
}

Response
{
    "RedirectURL": "sample string 1",
    "PUN": "sample string 2",
    "TransactionID": "sample string 3",
    "ResponseCode": "sample string 4",
    "MobileNumber": "sample string 5",
    "Amount": 6.0,
    "TransactionStatus": "sample string 8",
    "Reference": "sample string 9",
    "Provider": "sample string 10",
    "success": true,
    "errors": []
}`,
          },
        ],
      },
    ],
  },
  {
    id: "android",
    label: "Android",
    sections: [
      {
        id: "android-step1",
        heading: "Step 1. Add the JitPack repository to your build file",
        paragraphs: ["Add it in your root build.gradle at the end of repositories."],
        blocks: [
          {
            code: `allprojects {
  repositories {
    ...
    maven { url 'https://jitpack.io' }
  }
}`,
          },
        ],
      },
      {
        id: "android-step2",
        heading: "Step 2. Add the dependency",
        paragraphs: ["Add the following dependency in your app-level build.gradle."],
        blocks: [
          {
            code: `dependencies {
  implementation 'com.github.Qmobile-IT:NoqoodyPaySDK:1.0.13'
}`,
          },
        ],
      },
      {
        id: "android-step3",
        heading: "Step 3. To call payment",
        paragraphs: ["Use the following method to initiate a payment. Note: base URL should end with \u201c / \u201d."],
        blocks: [
          {
            code: `NoqoodyPay.Pay(Activity activity, String baseURL, String UserName, String Password,
  Double Amount, String CustomerEmail, String CustomerMobile, String ProjectCode,
  String Description, String RedirectURL, String Reference, String ClientSecret)`,
          },
        ],
      },
      {
        id: "android-step4",
        heading: "Step 4. To receive payment status",
        paragraphs: ["Override the onActivityResult method in your activity to handle payment status."],
        blocks: [
          {
            code: `public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == NoqoodyPay_Keys.Activity_RequestCode) {
        if (resultCode == Activity.RESULT_OK) {
            data.getStringExtra(NoqoodyPay_Keys.paymentresult_status);
            data.getStringExtra(NoqoodyPay_Keys.paymentresult);
            data.getStringExtra(NoqoodyPay_Keys.paymentresultData);
        }
    }
}`,
          },
        ],
      },
    ],
  },
  {
    id: "ios",
    label: "iOS",
    sections: [
      {
        id: "ios-files",
        heading: "iOS integration files",
        paragraphs: [
          "Download the necessary files for integration with iOS, then follow the same token, link generation and validation flow described in the Web tab.",
        ],
      },
    ],
  },
];

export const guideDownloads = [
  { label: "Postman collection \u2014 Production", href: "https://documenter.getpostman.com/view/8233756/UUxz9SQD" },
  { label: "Postman collection \u2014 Sandbox", href: "https://documenter.getpostman.com/view/8233756/UV5WDxk8" },
  { label: "Android APK & docs", href: "https://noqoody.com/old_site/assets/files/documentation/android/android.zip" },
  { label: "iOS integration files", href: "https://noqoody.com/old_site/assets/files/documentation/ios/ios.zip" },
];

export type Plugin = {
  id: string;
  name: string;
  img: string;
  description?: string;
  sections: { heading: string; steps: string[] }[];
  downloads: { label: string; href: string }[];
};

const configSteps = [
  "UserName provided by NoqoodyPay",
  "Password provided by NoqoodyPay",
  "Project Code provided by NoqoodyPay",
  "Order status for a successfully processed payment (must be processing)",
  "Mode for payment gateway: LIVE / DEMO",
  "Enable the module",
  "Set the Callback URL shown on the settings page in the NoqoodyPay admin",
];

export const plugins: Plugin[] = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    img: "/plugins/woocommerce.webp",
    description:
      "A plugin that allows you to extend your WooCommerce installation with the Noqoody payment processor. Your customers will be able to pay straight from your checkout page.",
    sections: [
      {
        heading: "Installation",
        steps: [
          "Upload the WooCommerce-noqoodypay-payment plugin to the /wp-content/plugins/ directory.",
          "Activate the plugin through the 'Plugins' menu in WordPress.",
          "Navigate to WooCommerce > Settings > Payment Gateways to configure the Noqoody gateway settings.",
        ],
      },
      {
        heading: "Configuration",
        steps: [
          "Enable Noqoody",
          "Enable Noqoody test or live mode. Recommended: make a few test payments before you go live.",
          "Enter the title and description the customer will see on the checkout page.",
          "Enter UserName provided by NoqoodyPay",
          "Enter Password provided by NoqoodyPay",
          "Enter Project Code provided by NoqoodyPay",
          "Set the Callback URL shown on the settings page in the NoqoodyPay admin.",
        ],
      },
    ],
    downloads: [
      { label: "WooCommerce v1", href: "https://www.noqoody.com/plugins/woocommerce-noqoodypay-payment.zip" },
      { label: "WooCommerce v2", href: "https://www.noqoody.com/plugins/woocommerce-noqoodypay-payment-special.zip" },
    ],
  },
  {
    id: "magento",
    name: "Magento",
    img: "/plugins/magento.webp",
    description:
      "This extension utilizes the NoqoodyPAY API and provides seamless integration with Magento, allowing a secure way for individuals and businesses to make and receive payments online or on mobile through features like the Noqoody Wallet and other payment options.",
    sections: [
      {
        heading: "Installation",
        steps: [
          "We recommend you duplicate your live store on a staging/test site and try the installation there in advance.",
          "Backup Magento files and the store database.",
          "Log into your hosting space via an FTP client.",
          "Unzip the extension package and upload it into the Magento root directory (App / code).",
          "Run php bin/magento setup:upgrade",
          "Run php bin/magento setup:static-content:deploy",
          "Check the module is installed using bin/magento module:status \u2014 you should see Gateway_Noqoody in the module list.",
          "Go to Admin > Stores > Configuration > Payment Method > Noqoody to configure Noqoody.",
          "If you do not see Noqoody in your gateway list, clear your Magento cache from the admin panel (System > Cache Management).",
        ],
      },
      { heading: "Module settings", steps: configSteps },
    ],
    downloads: [{ label: "Download Magento plugin", href: "https://www.noqoody.com/plugins/magento.zip" }],
  },
  {
    id: "opencart",
    name: "OpenCart",
    img: "/plugins/opencart.webp",
    sections: [
      {
        heading: "Installation",
        steps: [
          "Backup your web store and database.",
          "Upload the upload directory content to your OpenCart installation directory.",
          "Activate the module in payment extensions (Extensions > Payments).",
        ],
      },
      {
        heading: "Configure the module settings",
        steps: [
          ...configSteps,
          "Optionally set a sort order ID to move the payment option higher in the payment method list.",
        ],
      },
    ],
    downloads: [
      { label: "Download OpenCart 2", href: "https://www.noqoody.com/plugins/noqoodypay-oc2.zip" },
      { label: "Download OpenCart 3", href: "https://www.noqoody.com/plugins/noqoodypay-oc3.zip" },
    ],
  },
  {
    id: "prestashop",
    name: "PrestaShop",
    img: "/plugins/prestashop.webp",
    description:
      "The Noqoody payment gateway plugin for PrestaShop allows you to easily configure and accept Noqoody payments on your PrestaShop web store. This module is compatible with PrestaShop 1.7+.",
    sections: [
      {
        heading: "Installation",
        steps: [
          "Copy the Noqoody module files into your PrestaShop installation.",
          "Configure your Noqoody account for use with PrestaShop.",
          "Configure the module with your Noqoody account information.",
          "Installing via file upload: upload noqoodypay.zip through the PrestaShop module upload interface.",
          "In the left menu of your PrestaShop admin, hover over \u201cModules\u201d, select \u201cModules and Services\u201d, choose \u201cUpload a Module\u201d and select noqoodypay.zip.",
          "When the upload is complete, a confirmation message displays with a link to configure the module options.",
        ],
      },
      {
        heading: "Configuring your Noqoody settings on PrestaShop",
        steps: [
          "UserName provided by NoqoodyPay",
          "Password provided by NoqoodyPay",
          "Project Code provided by NoqoodyPay",
          "Mode for payment gateway: LIVE / DEMO",
          "Enable the module",
          "Set the Callback URL shown on the settings page in the NoqoodyPay PrestaShop admin.",
        ],
      },
    ],
    downloads: [{ label: "Download PrestaShop plugin", href: "https://www.noqoody.com/plugins/prestashop.zip" }],
  },
  {
    id: "shopify",
    name: "Shopify",
    img: "/plugins/shopify.webp",
    description: "Find the Shopify documentation download link below.",
    sections: [],
    downloads: [
      { label: "Download Shopify documentation", href: "https://www.noqoody.com/plugins/noqoody_shopify_documentation.pdf" },
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What is Noqoody online payment?",
    a: "Noqoody is the largest payment gateway in Qatar. It is an online payment solution that allows you to accept customer payments online.",
  },
  {
    q: "What does Noqoody online payments do?",
    a: "We manage the authorization and transfer of funds between your customers' credit card and your bank account. With our payment gateway, we ensure that credit card data is transmitted securely from your website to your internet merchant account and card providers.",
  },
  {
    q: "Why Noqoody?",
    a: "Noqoody offers the widest range of payment options. It is empowered by a cutting-edge, scalable IT platform and advanced technology that processes millions of transactions daily and has the capacity to process 10X more. Noqoody offers you comprehensive statistical online reports and a transparent view of all your transactions in real time.",
  },
  {
    q: "What payment types can I accept?",
    a: "The Noqoody solution provides processing services for all major card brands as well as for credit card / ATM / direct mobile billing / third party transactions.",
  },
  {
    q: "How long does it take to set up my payment method?",
    a: "How fast your payment system is set up depends entirely on your requirements for your payment solution and the degree to which you wish to tailor your payment page.",
  },
  {
    q: "How secure are online payments to my customers?",
    a: "To keep your risk to a minimum, Noqoody sets requirements for data and process security. Our service center meets all security requirements. For security and protection against fraud, all our products are certified and internationally approved.",
  },
  {
    q: "What does tokenization mean?",
    a: "Tokenization is a process in which sensitive data such as credit card numbers are replaced by substitute numbers called tokens. The original data is kept in our computer center where it is secure and protected. The tokenization service allows merchants to offer one-click checkout and process recurring payments.",
  },
  {
    q: "Can Noqoody help me prevent future chargebacks?",
    a: "The program includes assistance in creating a chargeback reduction plan as well as prevention tips specific to your business model.",
  },
  {
    q: "Why is Noqoody better than the other options that I'm considering?",
    a: "People choosing us appreciate reduced administration, simple low pricing, powerful tools that suit them, and a personal touch \u2014 help whenever you need us.",
  },
];