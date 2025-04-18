const axios = require('axios');
require('dotenv').config();
const fetch = require('node-fetch-commonjs');

    const createdOrder = async (req, res) => {
        const amount = req.body.amount
        const base = "https://api-m.sandbox.paypal.com";
        const {
            PAYPAL_CLIENT_SECRET,
            PAYPAL_CLIENT_ID
        } = process.env;


        const url = "https://torii-tau.vercel.app/api"
        //const url = "http://localhost:3001/api"

        const order = {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: amount,
                },
            }, ],
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
                "AeO-um8zrvmqdSaHtWiqgzC0BqfYL9LiofIo7KfVulHS6lNZX8aigypuuNptEDJvvcx5cUmpH4zTRybq" +
                ":" +
                "EKK8-7z40G6WpS7AhtlGQWANBUBpyPhSW8ViDoMxXTQ9buhrDkXwA73reyI_Bey-tKGgvSUG4CGYHLuz"
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
        const {
            token
        } = req.query;
        try {
            const response = await axios.post(
                `${base}/v2/checkout/orders/${token}/capture`, {}, {
                    auth: {
                        username: "AeO-um8zrvmqdSaHtWiqgzC0BqfYL9LiofIo7KfVulHS6lNZX8aigypuuNptEDJvvcx5cUmpH4zTRybq",
                        password: "EKK8-7z40G6WpS7AhtlGQWANBUBpyPhSW8ViDoMxXTQ9buhrDkXwA73reyI_Bey-tKGgvSUG4CGYHLuz",
                    },
                }
            );



            //return res.json(response.data);
            //return res.redirect( `https://www.paypal.com/`);
        return  res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Cerrar Ventana</title>
                    </head>
                    <body>
                        <script>
                            window.addEventListener('DOMContentLoaded', () => {                           
                            if (window.opener) {
                                window.close();
                            }
                            });
                        </script>
                    </body>
                    </html>
            `);


        } catch (error) {
            console.log(error)
        }

    };

    const statusOrder = async (req, res) => {
        try {
            const {
                id
            } = req.body;
            const base = "https://api-m.sandbox.paypal.com";
            const auth = Buffer.from(
                "AeO-um8zrvmqdSaHtWiqgzC0BqfYL9LiofIo7KfVulHS6lNZX8aigypuuNptEDJvvcx5cUmpH4zTRybq" +
                ":" +
                "EKK8-7z40G6WpS7AhtlGQWANBUBpyPhSW8ViDoMxXTQ9buhrDkXwA73reyI_Bey-tKGgvSUG4CGYHLuz"
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