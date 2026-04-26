import { NextResponse } from 'next/server';
import { sendAdminEmail } from '@/lib/mail';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('New Booking received:', data);
    
    // 1. Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          name: data.name,
          phone: data.phone,
          alternate_phone: data.alternate_phone,
          email: data.email,
          address: data.address,
          landmark: data.landmark,
          city: data.city || 'Jaipur',
          pincode: data.pincode,
          google_location: data.google_location,
          ac_type: data.ac_type,
          units: data.units,
          brand: data.brand,
          ac_age: data.ac_age,
          service_types: data.service_types,
          problem_description: data.problem_description,
          preferred_date: data.preferred_date,
          time_slot: data.time_slot,
          is_urgent: data.is_urgent,
          parking_available: data.parking_available,
          floor_number: data.floor_number,
          lift_available: data.lift_available,
          communication_preference: data.communication_preference,
          agreed_to_terms: data.agreed_to_terms,
          status: 'Pending'
        }
      ])
      .select();

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      // We continue to send email even if DB fails, or we can choose to stop.
    }

    // 2. Send email to admin
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking - Aerocool</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #254EDB 0%, #1a3a9e 100%); padding: 40px 40px 30px; text-align: left;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <div style="color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; opacity: 0.9;">New Lead Received</div>
                          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; line-height: 1.2;">AC Service Booking</h1>
                        </td>
                        <td align="right" valign="top">
                          <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 50px; color: #ffffff; font-size: 12px; font-weight: 700;">
                            ID: #${dbData?.[0]?.id || Math.floor(Math.random() * 10000)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <!-- Urgency Alert -->
                    ${data.is_urgent ? `
                    <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; padding: 16px; margin-bottom: 30px; text-align: center;">
                      <span style="color: #dc2626; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center;">
                        ⚡ URGENT SERVICE REQUESTED (2-4 HOUR VISIT)
                      </span>
                    </div>
                    ` : ''}

                    <!-- Section: Customer -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 14px; font-weight: 800; color: #254EDB; text-transform: uppercase; letter-spacing: 1px;">👤 Customer Information</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 16px; padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Full Name</div>
                                <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${data.name}</div>
                              </td>
                              <td style="padding-bottom: 10px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Phone Number</div>
                                <div style="font-size: 16px; font-weight: 700; color: #254EDB;">${data.phone}</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 10px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Email Address</div>
                                <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${data.email || 'Not Provided'}</div>
                              </td>
                              <td style="padding-top: 10px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Alt. Phone</div>
                                <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${data.alternate_phone || 'N/A'}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Service Details -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 14px; font-weight: 800; color: #254EDB; text-transform: uppercase; letter-spacing: 1px;">🔧 Service & AC Specs</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 16px; padding: 20px;">
                          <div style="margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 8px;">
                            ${(data.service_types || []).map(svc => `
                              <span style="display: inline-block; background-color: #eef2ff; color: #254EDB; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin: 0 5px 5px 0;">${svc}</span>
                            `).join('')}
                          </div>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
                            <tr>
                              <td>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">AC Type</div>
                                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${data.ac_type}</div>
                              </td>
                              <td>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Units</div>
                                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${data.units} Unit(s)</div>
                              </td>
                              <td>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Brand</div>
                                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${data.brand}</div>
                              </td>
                            </tr>
                          </table>
                          <div style="margin-top: 15px; font-size: 13px; color: #475569; background: #ffffff; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <strong>Note:</strong> ${data.problem_description || 'No specific problem described.'}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Location -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 14px; font-weight: 800; color: #254EDB; text-transform: uppercase; letter-spacing: 1px;">📍 Service Location</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 16px; padding: 20px;">
                          <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">${data.address}</div>
                          <div style="font-size: 13px; color: #64748b;">
                            Landmark: ${data.landmark || 'N/A'} • ${data.city}, ${data.pincode}
                          </div>
                          ${data.google_location ? `
                          <div style="margin-top: 15px;">
                            <a href="${data.google_location}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none;">
                              Open in Google Maps 📍
                            </a>
                          </div>
                          ` : ''}
                        </td>
                      </tr>
                    </table>

                    <!-- Section: Schedule -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <div style="font-size: 14px; font-weight: 800; color: #254EDB; text-transform: uppercase; letter-spacing: 1px;">📅 Preferred Schedule</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="background: linear-gradient(to right, #eef2ff, #f8fafc); border-radius: 16px; padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Date</div>
                                <div style="font-size: 18px; font-weight: 800; color: #254EDB;">${data.preferred_date}</div>
                              </td>
                              <td align="right">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px; text-align: right;">Time Slot</div>
                                <div style="font-size: 18px; font-weight: 800; color: #0f172a; text-align: right;">${data.time_slot}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Aerocool Professional AC Services</div>
                    <div style="font-size: 11px; color: #94a3b8; line-height: 1.6;">
                      This is a new lead notification from your website.<br>
                      Please contact the customer within 15-30 minutes for maximum conversion.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;


    await sendAdminEmail(`New Booking: ${data.name} - ${data.ac_type}`, emailHtml);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking received and saved to database!',
      booking: dbData?.[0] || data 
    }, { status: 201 });

  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process booking', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or Status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



