export default async function handler(req, res) {
    // Headers CORS para permitir llamadas desde Framer
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") return res.status(200).end()
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

    const { items, total } = req.body

    try {
        const response = await fetch("https://paguelofacil.com/ext/pagoBotonW", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.PAGUELO_FACIL_API_KEY}`
            },
            body: JSON.stringify({
                cclw: process.env.PAGUELO_FACIL_CCLW,
                amount: total,
                taxAmount: 0,
                description: `Reserva Moses Bike Rentals ${items.length} item(s)`,
                success_url: "https://mosesbikerentals.com/gracias",
                cancel_url: "https://mosesbikerentals.com/error",
                lang: "ES"
            })
        })

        const data = await response.json()
        console.log("Páguelo Fácil response:", data)
        return res.status(200).json({ urlPago: data.url || data.link || data.paymentUrl })

    } catch (error) {
        console.error("Error:", error)
        return res.status(500).json({ error: error.message })
    }
}
