import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Preference from '@/models/Preference';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    let pref = await Preference.findOne({ userId: 'default_user' });
    if (!pref) {
      pref = await Preference.create({ userId: 'default_user' });
    }
    return NextResponse.json({ success: true, data: pref });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const body = await req.json();
    const pref = await Preference.findOneAndUpdate(
      { userId: 'default_user' },
      body,
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: pref });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
