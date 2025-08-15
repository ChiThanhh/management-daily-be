import supabase from "../config/supabaseClient.js";

export const upsertBankPrice = async (req, res) => {
    const { bank_id, date, price } = req.body;
    if (!bank_id || !date || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const { data, error } = await supabase
            .from('bank_prices')
            .upsert([{ bank_id, date, price }],
                { onConflict: 'bank_id,date' }
            )
            .select();
        if (error) {
            return res.status(500).json({ error: "Error upserting bank price" });
        }
        return res.status(200).json({ message: "Bank price upserted successfully", data });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
//lấy giá theo bank_id

export const getPriceByBank = async (req, res) => {
    const { bank_id } = req.params;


    try {
        const { data, error } = await supabase
            .from('bank_prices')
            .select('*')
            .eq('bank_id', bank_id);

        if (error) {
            return res.status(500).json({ error: "Error fetching bank prices" });
        }
        return res.status(200).json({ message: "Bank prices fetched successfully", data });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}