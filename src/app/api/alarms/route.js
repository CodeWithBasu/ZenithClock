import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Alarm from '@/models/Alarm';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true, message: 'MongoDB not connected, using client state' }, { status: 200 });
    }
    const alarms = await Alarm.find({}).sort({ time: 1 });
    return NextResponse.json({ success: true, data: alarms });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true, message: 'MongoDB not connected' }, { status: 200 });
    }
    const body = await req.json();
    const alarm = await Alarm.create(body);
    return NextResponse.json({ success: true, data: alarm }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const { id, ...updates } = await req.json();
    const alarm = await Alarm.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, data: alarm });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Alarm.findByIdAndDelete(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
