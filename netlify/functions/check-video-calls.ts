export const handler = async () => {
  const baseUrl = process.env.URL || "https://parto.online";
  const secret = process.env.CRON_SECRET || "";
  try {
    const res = await fetch(`${baseUrl}/api/cron/video-calls?secret=${secret}`);
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message }) };
  }
};
