// // app/api/payment/route.ts

// import { NextResponse } from 'next/server';
// import crypto from 'crypto';

// export async function POST(req: Request) {

//   const body = await req.json();

//   const amount = body.amount;

//   if (!amount) {
//     return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
//   }
//   // Onepay credentials
//   const appId = "3OXP118E67C29660A37D5";
//   const tokende = "764e154ef0e3d17d5cde96f8cc6dfa40da2e7a86c2f6c478d77a36e4d3c43b8d8e0c5f8f60712635.HWAY118E67C29660A3811";
//   const token = "755413b7951de2346cb8ef3d30f63f482d6e78cb7618964d70bea067f2426b425ab4310a0466bf98.HCAE11908A17139474F67";
//   const hashSalt = "HMGF118E67C29660A37FF";

//   // Request body for the transaction
//   const requestBody = {
//     amount: amount, // LKR 500
//     app_id: appId,
//     reference: "SPMTX123456", // Generate a unique reference ID here
//     customer_first_name: "John",
//     customer_last_name: "Doe",
//     customer_phone_number: "+94777123456",
//     customer_email: "john.doe@example.com",
//     transaction_redirect_url: "http://localhost:3000",
//     currency: "LKR"
//   };

//   // Step 1: Convert request body to a string and append the hash salt
//   const bodyString = JSON.stringify(requestBody).replace(/\s+/g, '') + hashSalt;

//   // Step 2: Generate the hash key using SHA256
//   const hash = crypto.createHash('sha256').update(bodyString).digest('hex');

//   // Step 3: Make the POST request to Onepay API
//   const response = await fetch(`https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-payment-link/?hash=${hash}`, {
//     method: "POST",
//     headers: {
//       Authorization: token,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(requestBody)
//   });

//   // Step 4: Handle the response
//   const data = await response.json();

//   if (data.status === 1000) {
//     // Return the payment gateway URL
//     return NextResponse.json({ redirect_url: data.data.gateway.redirect_url });
//   }

//   return NextResponse.json({ error: 'Failed to generate payment link' }, { status: 500 });
// }

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const frontend_url = process.env.FRONTEND_URL;

  console.log('came from setting hitting');

  try {
    const body = await req.json();
    const amount = body.amount;
    const merchant = body.merchant;
    const reservationData = body.AdditionalData;

    const process = body.process;

    console.log('Reservation Data:', reservationData);
    console.log('idhuve email', merchant);

    const reference = `SPMTX${Date.now()}`;
    reservationData.reference = reference;
    reservationData.process = process;
    const serializedReservationData = new URLSearchParams(
      reservationData,
    ).toString();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // live url one

    //   const appId = '3OXP118E67C29660A37D5';
    const appId = 'F77T118E68D8B41CC8DB4';

    // const token = '755413b7951de2346cb8ef3d30f63f482d6e78cb7618964d70bea067f2426b425ab4310a0466bf98.HCAE11908A17139474F67';
    const token =
      '1d49b2a551693518dec18ceaa94aef1afabc5e10ab7f307ee3c476c92f879110581f49ab583d047a.2WCU118E68D8B41CC8DEE';

    const hashSalt = '5O2H118E68D8B41CC8DDB';
    //   const hashSalt = 'HMGF118E67C29660A37FF';
    // live url one

    // development jmgcentral
    // const appId = 'GSE81190900DC27755CA2';
    // const token = '1d49b2a551693518dec18ceaa94aef1afabc5e10ab7f307ee3';
    // const token =
    //   'd7dc103fb528736c673d9cb9e3689404f111b7b2ad506304747c8c3c69fa9912e30a839ab152f198.KWOI1190900DC27755CDF';

    // const hashSalt = '0RJC1190900DC27755CCC';
    // development  jmgcentral

    // reservationData.reference = reference;

    // const cookieStore = cookies();
    // // cookieStore.set('payment_reference', reference, { httpOnly: true, maxAge: 3600 }); // expires in 1 hour

    // cookieStore.set('payment_reference', reference, {
    //   httpOnly: true,
    //   maxAge: 3600,
    //   sameSite: 'strict',

    //   path: '/',
    // });

    // setReference(reference);

    const requestBody = {
      amount: amount,
      app_id: appId,
      reference: reference,
      // customer_first_name: 'Jawidh',
      customer_first_name: merchant,
      // customer_last_name: 'muhammadh',
      customer_last_name: merchant,
      // customer_phone_number: '+94777123456',
      customer_phone_number: '+94777123456',
      // customer_email: 'jawidh@gmail.com',
      customer_email: merchant,
      // transaction_redirect_url: `http://localhost:3000/sn/${restaurantId}?paymentStatus=success&restaurantId=${restaurantId}&reference=${reference}`,
      // transaction_redirect_url: `${frontend_url}/settings&reference=${reference}`,
      transaction_redirect_url: `${frontend_url}/settings?reference=${reference}`,
      // transaction_redirect_url: `https://spotmytable.vercel.app`,
      // transaction_redirect_url: `https://spotmytable.vercel.app/sn/${restaurantId}?paymentStatus=success&restaurantId=${restaurantId}`,
      // transaction_failure_redirect_url: `http://localhost:3000/sn/${restaurantId}?paymentStatus=failure&restaurantId=${restaurantId}`,
      currency: 'LKR',
      // additional_data: JSON.stringify(reservationData)
      additional_data: serializedReservationData,
    };

    const bodyString =
      JSON.stringify(requestBody).replace(/\s+/g, '') + hashSalt;

    const hash = crypto.createHash('sha256').update(bodyString).digest('hex');

    const response = await fetch(
      `https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-payment-link/?hash=${hash}`,
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      },
    );

    const data = await response.json();

    if (data.status === 1000) {
      console.log('avalothaan');

      return NextResponse.json({
        redirect_url: data.data.gateway.redirect_url,
      });
    } else {
      console.error('Onepay API Error ERRor:', data);
      return NextResponse.json(
        { error: 'ffailed to generate payment link' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error process payment request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
