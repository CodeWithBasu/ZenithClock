import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PresetTimer from '@/models/PresetTimer';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const timers = await PresetTimer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: timers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const body = await req.json();
    const timer = await PresetTimer.create(body);
    return NextResponse.json({ success: true, data: timer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, fallback: true }, { status: 200 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await PresetTimer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
