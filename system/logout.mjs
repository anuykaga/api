export default async function (req, res) {
  /*
  if (!req.session.email) {
    return await res.status(400).json({
      error: "Lu Aja Blum Login Njir"
    })
  }
  */
  return await req.session.destroy(async err => {
    if (err) {
       return await res.status(500).json({
          error: "Error saat logout"
       })
    };
    return await res.redirect("/docs")
  })
}