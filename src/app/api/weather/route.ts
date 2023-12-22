import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: any) => {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");

  let url = "";
  if (address) {
    url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      address +
      "&appid=" +
      "4251cf89dabe6d287bfd39b3dab5c888";
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=4251cf89dabe6d287bfd39b3dab5c888`;
  }

  const res = await fetch(url);

  const data = await res.json();

  return NextResponse.json({ data });
};
