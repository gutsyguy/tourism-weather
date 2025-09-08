// /pages/api/google-maps.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Google Maps API key not configured" });
  }

  // Fetch Google Maps JS API from Google server
  const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly`;
  const response = await fetch(url);
  const js = await response.text();

  // Return JS to client
  res.setHeader("Content-Type", "application/javascript");
  res.status(200).send(js);
}
