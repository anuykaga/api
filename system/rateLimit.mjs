/*
   * by balzz
   * dont delete my wm
   * follow more instagram: @iqstore78
*/
import rateLimit from "express-rate-limit";

let bannedIPs = [];
const banDuration = 20 * 1000;

export const limit = rateLimit({
  windowMs: 10 * 1000, 
  max: 10,
  message: "Too Many Requests!, try again next time sensei",
  handler: (req, res) => {
    const ip = req.ip;

    // Cek apakah IP adalah lokal
    if (!bannedIPs.includes(ip) && !isLocalIP(ip)) {
      bannedIPs.push(ip);
      console.log(`IP ${ip} dibanned.`); 
      setTimeout(() => {
        bannedIPs = bannedIPs.filter(bannedIp => bannedIp !== ip);
        console.log(`${ip} Meakukan Flooading Request`);
      }, banDuration);
    }
    res.status(403).send("To Many Request Sensei, Try Again Next Time Sensei.");
  }
});

export const checkBanned = async (req, res, next) => {
  const ip = req.ip;

  // Cek apakah IP adalah lokal
  if (bannedIPs.includes(ip) && !isLocalIP(ip)) {
    return await res.status(403).send("To Many Request Sensei, Try Again Next Time!");
  }
  await next();
};

// Fungsi untuk mengecek apakah IP adalah lokal
const isLocalIP = (ip) => {
  return ip === '::1' || ip === '127.0.0.1' || ip === "::ffff:127.0.0.1"
};
