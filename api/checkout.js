export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

    const { items, total } = req.body

    // Construir los parámetros en formato URL (como requiere Páguelo Fácil)
    const params = new URLSearchParams({
        CCLW: process.env.PAGUELO_FACIL_CCLW,
        CMTN: total.toString(),
        CDSC: `Reserva Moses Bike Rentals - ${items.length} item(s)`,
        RETURN_URL: Buffer.from("https://mosesbikerentals.com/gracias").toString("hex"),
    })

    try {
        const response = await fetch("https://secure.paguelofacil.com/LinkDeamon.cfm", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": process.env.PAGUELO_FACIL_API_KEY
            },
            body: params.toString()
        })

        const data = await response.json()
        console.log("Páguelo Fácil response:", JSON.stringify(data))

        if (data && data.data && data.data.url) {
            return res.status(200).json({ urlPago: data.data.url })
        } else {
            return res.status(500).json({ error: "No se recibió URL de pago", detalle: data })
        }

    } catch (error) {
        console.error("Error:", error)
        return res.status(500).json({ error: error.message })
    }
}
