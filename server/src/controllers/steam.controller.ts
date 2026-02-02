import { Request, Response } from "express";
import { steamAuthAndImport } from "../services/steamAuth.service";

export async function steamLogin(req: Request, res: Response) {
  const returnUrl = encodeURIComponent(
    "http://localhost:3001/api/steam/callback"
  );

  const redirectUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${returnUrl}&openid.realm=http://localhost:3001/&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

  res.redirect(redirectUrl);
}

export async function steamCallback(req: Request, res: Response) {
  try {
    const steamId = req.query["openid.claimed_id"] as string;
    const id = steamId.split("/").pop();

    const result = await steamAuthAndImport(id!);

    res.redirect(`http://localhost:5173/?userId=${result.user.id}`);
  } catch (e) {
    res.status(500).json({ ok: false, error: e });
  }
}
