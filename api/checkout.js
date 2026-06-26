export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { items, total } = req.body

    try {
        const response = await fetch("https://sandbox.paguelofacil.com/LinkDeCobroCPFL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.PAGUELO_FACIL_API_KEY
            },
            body: JSON.stringify({
                cclw: process.env.PAGUELO_FACIL_CCLW,
                amount: total,
                taxAmount: 0,
                description: `Reserva Moses Bike Rentals - ${items.length} item(s)`,
                successUrl: "https://mosesbikerentals.com/gracias",
                failUrl: "https://mosesbikerentals.com/error",
                lang: "ES"
            })
        })

        const data = await response.json()
        return res.status(200).json({ urlPago: data.url || data.link })

    } catch (error) {
        return res.status(500).json({ error: "Error procesando el pago" })
    }
}
