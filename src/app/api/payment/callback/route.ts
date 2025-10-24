import { NextResponse } from 'next/server';

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('Received callback data:', JSON.stringify(body, null, 2));
    console.log('Received callback data:', JSON.stringify(body, null, 2));
    console.log('Received callback data:', JSON.stringify(body, null, 2));
    console.log('Received callback data:', JSON.stringify(body, null, 2));
    // const cookieStore = cookies();
    // const reference = cookieStore.get('payment_reference');

    const { transaction_id, status, status_message, additional_data } = body;

    console.log('this is the body', body);

    console.log('Transaction ID:', transaction_id);
    console.log('Status:', status);
    console.log('Status Message:', status_message);

    console.log('additional', additional_data);

    const parsedData = Object.fromEntries(new URLSearchParams(additional_data));
    const reference = parsedData.reference;
    const merchantEmail = parsedData.merchantEmail;
    const subscription = parsedData.subscription;

    // save all custom

    let customID = '';
    // save all custom

    // console.log("irukaa illayaa" , parsedData?.reservationId);
    // console.log("irukaa illayaa reservation ref" , parsedData?.reservationRef);

    // if(parsedData?.reservationId) {
    //   customID = parsedData?.reservationId
    //   // delete parsedData.reference;
    //   // delete parsedData?.reservationRef
    // }
    // delete parsedData.reference;

    // console.log("everything is parsed" , parsedData);

    if (status === 1 && status_message === 'SUCCESS') {
      console.log('Payment was successful');
    } else {
      console.log('Payment failed');
    }

    // const reference = getReference();
    // if(reference) {
    //   console.log(reference);

    // } else {
    //   console.log("no refernce number have da have");

    // }
    // if (!reference) {
    //   return NextResponse.json({ error: 'Reference not found' }, { status: 400 });
    // }

    // save payment info backend

    try {
      const response = await fetch(`${backend_url}/api/payment/save-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id,
          status,
          status_message,

          reference,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        console.log('Payment saved successfully');
      } else {
        console.log('Failed to save payment');
      }
    } catch (error) {
      console.log('hello error', error);
    }

    // change status of subscrition for merchant

    try {
      if (status === 1 && status_message === 'SUCCESS') {
        const response = await fetch(
          `${backend_url}/merchant/update-subscription`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: merchantEmail,
              subscription: subscription, // should be 'free', 'pro', or 'premium'
            }),
          },
        );

        const responseData = await response.json();

        if (response.ok) {
          console.log(
            'Subscription updated successfully:',
            responseData.data.merchant.subscription,
          );
          // optionally update your state here
        } else {
          console.error('Failed to update subscription:', responseData.message);
        }
      } else {
        console.log('payment was not success, subscription not updated');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
    // change status of subscrition for merchant

    // save payment info backend

    // save reservation
    //  try {

    //   if(status_message === 'SUCCESS' && (!customID || customID === "")) {
    //          console.log(" inside of nnormal reservation save");
    //          console.log("customID NORMAL" , customID);

    //     const response = await fetch(`${backend_url}/reservations`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       // body: JSON.stringify({
    //       //   date:reservationDate,
    //       //   start_time: ReservationstartTime,
    //       //   end_time: ReservationendTime,
    //       //   guest_count: ReservationguestCount,
    //       //   table_id: reservationTableId,
    //       //   merchant_id : reservationMerchantID,
    //       //   merchant_name : reservationMerchantName ,
    //       //   customer_email : session?.user.email,
    //       //   customer_name : session?.user.name,
    //       //   customer_number : session?.user.phone,
    //       //   table_number : tableNumber,
    //       //   reservation_fee : 0

    //       // }),
    //       body: JSON.stringify(parsedData),
    //     });

    //     console.log(response);

    //     console.log(" inside of nnormal reservation save -- DONE DONE DONE");

    //   }

    //   if(status_message === "SUCCESS" && customID?.length  > 0) {
    //     console.log("custom order NEW CHECK");

    //     console.log("when the function triggers" , customID);

    //     try {
    //       const response = await fetch(`${backend_url}/reservations/custom-reservations/status/${customID}`, {
    //         method: 'PUT', // HTTP method
    //         headers: {
    //           'Content-Type': 'application/json', // Ensure JSON content type
    //         },
    //       });

    //       if (!response.ok) {
    //         const errorData = await response.json();
    //         console.error('Error updating reservation:', errorData.message);
    //         throw new Error(errorData.message || 'Failed to update reservation status');
    //       }

    //       const updatedReservation = await response.json(); // Parse JSON response
    //       console.log('Reservation updated successfully:', updatedReservation);
    //       return updatedReservation;
    //     } catch (error:any) {
    //       console.error('Error:', error.message);
    //       throw error;
    //     }

    //   }

    //  } catch (error) {
    //   console.log(error);

    //  }

    // save reservation
    console.log('hello naa peit pesuren');

    return NextResponse.json(
      { message: 'Callback processed successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
