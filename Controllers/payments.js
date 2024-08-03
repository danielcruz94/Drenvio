const axios = require('axios');
require('dotenv').config();
const fetch = require('node-fetch-commonjs');

  const createdOrder = async (req, res) => {
    const amount=req.body.amount  
    const base = "https://api-m.sandbox.paypal.com";
    const { PAYPAL_CLIENT_SECRET, PAYPAL_CLIENT_ID } = process.env;

         
      //const url = "https://torii-tau.vercel.app/api"
      const url = "http://localhost:3001/api"      

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        brand_name: "toriiApp",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${url}/capturedorder`,
        cancel_url: `${url}/cancelpayment`,
      },
    };

    try {
      const auth = Buffer.from(
        "Ac1qy1cFXogAa7YTGGXPqom7sNjPiq4ZinSUm7JYpZW7gRyffKH0K99OKjKJqECPyYrArNhFgAj9WTl0" +
          ":" +
          "EK1hlpZKoeCtZq7Bh5XcRpT8c3X87zradoM48a0uIihcd9ZwuZmuY0KyugSsDX6dakLXiQIGzPf3lyah"
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const data = await response.json();
      
      //   return data.access_token;
      const solution = await axios.post(`${base}/v2/checkout/orders`, order, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      
      
      return res.json(solution.data);
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }

    
  };

 const capturedOrder = async (req, res) => {
   const base = "https://api-m.sandbox.paypal.com";
   const { token } = req.query;
try {
  const response = await axios.post(
    `${base}/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username:
          "Ac1qy1cFXogAa7YTGGXPqom7sNjPiq4ZinSUm7JYpZW7gRyffKH0K99OKjKJqECPyYrArNhFgAj9WTl0",
        password:
          "EK1hlpZKoeCtZq7Bh5XcRpT8c3X87zradoM48a0uIihcd9ZwuZmuY0KyugSsDX6dakLXiQIGzPf3lyah",
      },
    }
  );



  return res.json(response.data);
} catch (error) {
  console.log(error)
}
   
 };

 const statusOrder = async (req, res) => {
   try {
     const { id } = req.body;
     const base = "https://api-m.sandbox.paypal.com";
     const auth = Buffer.from(
       "Ac1qy1cFXogAa7YTGGXPqom7sNjPiq4ZinSUm7JYpZW7gRyffKH0K99OKjKJqECPyYrArNhFgAj9WTl0" +
         ":" +
         "EK1hlpZKoeCtZq7Bh5XcRpT8c3X87zradoM48a0uIihcd9ZwuZmuY0KyugSsDX6dakLXiQIGzPf3lyah"
     ).toString("base64");
     const response = await fetch(`${base}/v1/oauth2/token`, {
       method: "POST",
       body: "grant_type=client_credentials",
       headers: {
         Authorization: `Basic ${auth}`,
       },
     });

     const data = await response.json();

     const solution = await axios(`${base}/v2/checkout/orders/${id}`, {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${data.access_token}`,
       },
     });

 

     return res.json(solution.data.status);
   } catch (error) {
     console.log(error);
   }

   
 };


 const cancelOrder = async (req, res) => {
   

return res.json('CANCELED')

}



module.exports = {
    createdOrder,
    capturedOrder,
    cancelOrder,
    statusOrder
   
      
  };

