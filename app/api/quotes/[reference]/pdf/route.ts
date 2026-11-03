import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateQuotePdf } from '../../../../../lib/quote-pdf';
import { prisma } from '../../../../../lib/prisma';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../../../../lib/guest-session';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;
  if (!(await verifyGuestSession(token))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { reference } = await params;
  const quote = await prisma.quote.findUnique({
    where: { reference },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          county: true,
          postcode: true,
        },
      },
      repairJob: { select: { reference: true, equipment: true, issue: true } },
      items: { orderBy: { id: 'asc' } },
    },
  });

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
  }

  try {
    const pdf = await generateQuotePdf({
      reference: quote.reference,
      status: quote.status,
      issuedAt: quote.issuedAt,
      validUntil: quote.validUntil,
      customer: {
        name: `${quote.customer.firstName} ${quote.customer.lastName}`,
        email: quote.customer.email,
        phone: quote.customer.phone,
        address: [
          quote.customer.addressLine1,
          quote.customer.addressLine2,
          quote.customer.city,
          quote.customer.county,
          quote.customer.postcode,
        ]
          .filter(Boolean)
          .join(', '),
      },
      repairJob: quote.repairJob,
      items: quote.items,
    });
    const filename = quote.reference.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}.pdf"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Quote PDF generation failed for ${reference}:`, error);
    return NextResponse.json({ error: 'Unable to generate quote PDF.' }, { status: 500 });
  }
}