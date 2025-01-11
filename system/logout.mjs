export default function (req, res) {
  if (!req.session.email) {
    return res.status(400).json({
      error: "Lu Aja Blum Login Njir"
    })
  }
  req.session.destroy(err => {
    if (err) return res.status(500).json({
      error: "Error saat logout"
    })
    res.redirect("/docs")
  })
}